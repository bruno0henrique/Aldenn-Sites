"use client";

import { useState } from "react";
import { ArrowDownRight, Calculator, Info } from "lucide-react";
import { calculateFinancing } from "@/lib/finance";
import { preciseMoney, number } from "@/lib/format";

export function Financing({ price }: { price: number }) {
  const [entry, setEntry] = useState(String(Math.round(price * 0.3)));
  const [months, setMonths] = useState("420");
  const [rate, setRate] = useState("10");
  let result: ReturnType<typeof calculateFinancing> | null = null;
  let error = "";
  try {
    if ([entry, months, rate].some((value) => !value.trim())) throw new Error("Preencha os valores da simulação.");
    result = calculateFinancing({ price, downPayment: Number(entry), months: Number(months), annualRate: Number(rate) });
  } catch (issue) { error = issue instanceof Error ? issue.message : "Confira os valores informados."; }
  return <section className="financing" id="financiamento" aria-labelledby="finance-title">
    <div className="section-heading"><div><span className="eyebrow"><Calculator size={14} /> PLANEJE A COMPRA</span><h2 id="finance-title">Seu próximo passo,<br /><em>em números.</em></h2></div></div>
    <p className="finance-intro">Explore um cenário favorável e ajuste os valores ao seu planejamento.</p>
    <div className="finance-grid"><div className="finance-fields">
      <label>Valor do imóvel<input readOnly value={preciseMoney(price)} aria-label="Valor do imóvel" /></label>
      <label>Entrada (R$)<input aria-label="Entrada (R$)" type="number" inputMode="decimal" min={0} max={price} step="any" value={entry} onChange={(event) => setEntry(event.target.value)} aria-describedby="entry-help" aria-invalid={!!error} /><small id="entry-help">{entry && Number(entry) >= 0 && Number(entry) <= price ? `${number(Number(entry) / price * 100)}% do valor do imóvel` : "Informe um valor entre zero e o preço do imóvel."}</small></label>
      <div className="field-row"><label>Prazo (meses)<input type="number" inputMode="numeric" min={1} max={420} step={1} value={months} onChange={(event) => setMonths(event.target.value)} /></label><label>Juros efetivos (% a.a.)<input type="number" inputMode="decimal" min={0} max={100} step="any" value={rate} onChange={(event) => setRate(event.target.value)} /></label></div>
      <p className="microcopy">Cálculo pela tabela Price. Juros anuais convertidos para taxa mensal equivalente.</p>
    </div><div className="finance-result" aria-live="polite" aria-atomic="true">
      {result ? <><span className="eyebrow">PARCELA MENSAL ESTIMADA</span><strong className="finance-payment" data-testid="payment">{preciseMoney(result.payment)}</strong><span className="finance-term">{result.financed === 0 ? "Entrada integral. Não há valor a financiar." : `em ${months} meses · ${number(result.monthlyRate * 100)}% ao mês`}</span><div className="finance-divider" /><dl><div><dt>Valor financiado</dt><dd>{preciseMoney(result.financed)}</dd></div><div><dt>Juros totais</dt><dd>{preciseMoney(result.interest)}</dd></div><div><dt>Total das parcelas</dt><dd>{preciseMoney(result.totalPayments)}</dd></div></dl><ArrowDownRight className="finance-decoration" size={45} strokeWidth={1} /></> : <p role="alert" className="finance-error">{error}</p>}
    </div></div>
    <p className="finance-disclaimer"><Info size={16} /><span>Simulação ilustrativa, sem vínculo com bancos ou aprovação de crédito. A taxa inicial de 10% ao ano é uma hipótese demonstrativa. Seguros, tarifas, impostos de aquisição e correção monetária não estão incluídos. Condições reais dependem de análise da instituição financeira.</span></p>
  </section>;
}
