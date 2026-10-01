export const basePath = "/demonstracao-imobiliaria";
export const asset = (path: string) => path.startsWith("data:image/") ? path : `${basePath}${path}`;
export const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
export const preciseMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
export const number = (value: number) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
