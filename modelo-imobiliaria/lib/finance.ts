export type FinancingInput = { price: number; downPayment: number; months: number; annualRate: number };

export function calculateFinancing({ price, downPayment, months, annualRate }: FinancingInput) {
  if (![price, downPayment, months, annualRate].every(Number.isFinite)) throw new Error("Preencha os valores da simulação.");
  if (price <= 0 || downPayment < 0 || downPayment > price) throw new Error("A entrada deve ficar entre zero e o valor do imóvel.");
  if (!Number.isInteger(months) || months < 1 || months > 420) throw new Error("O prazo deve ser de 1 a 420 meses.");
  if (annualRate < 0 || annualRate > 100) throw new Error("Informe juros de 0% a 100% ao ano.");
  const financed = price - downPayment;
  const monthlyRate = Math.expm1(Math.log1p(annualRate / 100) / 12);
  const payment = financed === 0 ? 0 : monthlyRate === 0 ? financed / months :
    financed * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
  const totalPayments = payment * months;
  return { financed, monthlyRate, payment, totalPayments, interest: Math.max(0, totalPayments - financed) };
}
