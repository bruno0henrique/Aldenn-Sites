"use client";

import { useState } from "react";
import { Calculator, Info } from "lucide-react";
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
  const paymentParts = result ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).formatToParts(result.payment) : [];
  return <section className="financing" id="financiamento" aria-labelledby="finance-title">
    <div className="section-heading"><div><span className="eyebrow"><Calculator size={14} /> PLANEJE A COMPRA</span><h2 id="finance-title">Seu próximo passo,<br /><em>em números.</em></h2></div></div>
    <p className="finance-intro">Explore um cenário favorável e ajuste os valores ao seu planejamento.</p>
    <div className="finance-grid"><div className="finance-fields">
      <label>Valor do imóvel<input readOnly value={preciseMoney(price)} aria-label="Valor do imóvel" /></label>
      <label>Entrada (R$)<input aria-label="Entrada (R$)" type="number" inputMode="decimal" min={0} max={price} step="any" value={entry} onChange={(event) => setEntry(event.target.value)} aria-describedby="entry-help" aria-invalid={!!error} /><small id="entry-help">{entry && Number(entry) >= 0 && Number(entry) <= price ? `${number(Number(entry) / price * 100)}% do valor do imóvel` : "Informe um valor entre zero e o preço do imóvel."}</small></label>
      <div className="field-row"><label>Prazo (meses)<input type="number" inputMode="numeric" min={1} max={420} step={1} value={months} onChange={(event) => setMonths(event.target.value)} /></label><label>Juros efetivos (% a.a.)<input type="number" inputMode="decimal" min={0} max={100} step="any" value={rate} onChange={(event) => setRate(event.target.value)} /></label></div>
      <p className="microcopy">Cálculo pela tabela Price. Juros anuais convertidos para taxa mensal equivalente.</p>
    </div><div className="finance-result" aria-live="polite" aria-atomic="true">
      {result ? <><div className="finance-summary"><span className="eyebrow">SUA SIMULAÇÃO</span><p className="finance-payment-label">Parcela mensal estimada</p><strong className="finance-payment" data-testid="payment">{paymentParts.map((part, index) => <span key={index} className={part.type === "currency" ? "payment-currency" : part.type === "decimal" || part.type === "fraction" ? "payment-decimal" : undefined}>{part.value}</span>)}</strong><span className="finance-term">{result.financed === 0 ? "Entrada integral. Não há valor a financiar." : <><span>{months} parcelas · {number(Number(months) / 12)} anos</span><span>{new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(result.monthlyRate * 100)}% de juros ao mês</span></>}</span></div><dl className="finance-breakdown"><div><dt>Valor financiado</dt><dd>{preciseMoney(result.financed)}</dd></div><div><dt>Juros ao longo do prazo</dt><dd>{preciseMoney(result.interest)}</dd></div><div className="finance-total"><dt>Total das parcelas</dt><dd>{preciseMoney(result.totalPayments)}</dd></div></dl><p className="finance-total-note">Total das parcelas sem incluir a entrada.</p></> : <p role="alert" className="finance-error">{error}</p>}
    </div></div>
    <p className="finance-disclaimer"><Info size={16} /><span>Simulação ilustrativa, sem vínculo com bancos ou aprovação de crédito. A taxa inicial de 10% ao ano é uma hipótese demonstrativa. Seguros, tarifas, impostos de aquisição e correção monetária não estão incluídos. Condições reais dependem de análise da instituição financeira.</span></p>
  </section>;
}
