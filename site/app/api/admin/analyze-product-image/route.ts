import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const ProductImageAnalysis = z.object({
  name: z.string(),
  category: z.string(),
  color: z.string(),
  size: z.string(),
  price_cents: z.number().int().nonnegative(),
  description: z.string(),
  visible_text: z.string(),
  confidence: z.number().min(0).max(1),
  warnings: z.array(z.string()),
});

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return json({ error: 'Origem da solicitação não permitida.' }, 403);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return json({ error: 'Sessão expirada.' }, 401);

  const { data: staff, error: staffError } = await supabase
    .from('staff_members')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (staffError || !['owner', 'admin'].includes(staff?.role || '')) {
    return json({ error: 'Esta conta não tem acesso às aprovações.' }, 403);
  }

  const { data: categoryRows, error: categoriesError } = await supabase
    .from('catalog_categories')
    .select('name')
    .eq('is_active', true)
    .order('sort_order');
  if (categoriesError) {
    return json({ error: 'Não foi possível carregar as categorias.' }, 503);
  }
  const categoryNames = (categoryRows || []).map((category) => category.name);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(
      {
        error: 'O preenchimento automático ainda precisa ser configurado.',
      },
      503,
    );
  }

  let image: File;
  try {
    const formData = await request.formData();
    const entry = formData.get('image');
    if (!(entry instanceof File)) {
      return json({ error: 'Envie uma imagem para análise.' }, 400);
    }
    image = entry;
  } catch {
    return json({ error: 'Não foi possível ler a imagem enviada.' }, 400);
  }

  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return json({ error: 'Use uma imagem JPG, PNG ou WebP.' }, 415);
  }
  if (image.size <= 0 || image.size > MAX_IMAGE_SIZE) {
    return json({ error: 'A imagem deve ter no máximo 10 MB.' }, 413);
  }

  try {
    const bytes = Buffer.from(await image.arrayBuffer());
    const imageUrl = `data:${image.type};base64,${bytes.toString('base64')}`;
    const openai = new OpenAI({ apiKey });
    const response = await openai.responses.parse({
      model: process.env.OPENAI_VISION_MODEL || 'gpt-5-nano',
      store: false,
      reasoning: { effort: 'minimal' },
      instructions: `Analise artes de produtos de moda da Belleland Closet. Extraia somente informações visíveis na imagem. Não invente nome, preço, tamanho, cor ou características. Use strings vazias quando um dado não estiver legível. Converta preço em reais para centavos, por exemplo R$ 89,90 vira 8990. A descrição deve ser curta, objetiva e apropriada para catálogo. Registre incertezas em warnings. Para category, use exatamente um dos nomes desta lista ou retorne string vazia quando nenhum for adequado: ${categoryNames.join(', ')}.`,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'Extraia os dados desta peça para preencher um cadastro que será revisado manualmente antes da publicação.',
            },
            {
              type: 'input_image',
              image_url: imageUrl,
              detail: 'high',
            },
          ],
        },
      ],
      text: {
        format: zodTextFormat(ProductImageAnalysis, 'product_image_analysis'),
      },
      max_output_tokens: 1200,
    });

    if (!response.output_parsed) {
      return json(
        { error: 'A imagem não retornou dados suficientes para o cadastro.' },
        422,
      );
    }

    const analysis = response.output_parsed;
    const normalizedCategory = categoryNames.find(
      (category) => category === analysis.category,
    );
    return json({
      analysis: {
        ...analysis,
        category: normalizedCategory || '',
      },
    });
  } catch (error) {
    const requestId =
      error instanceof OpenAI.APIError ? error.requestID : undefined;
    return json(
      {
        error: 'Não foi possível analisar a imagem agora. Tente novamente.',
        requestId,
      },
      502,
    );
  }
}
