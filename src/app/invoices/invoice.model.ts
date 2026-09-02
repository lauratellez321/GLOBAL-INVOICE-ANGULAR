export type InvoiceType = string;
export interface Invoice {
  id: number;
  type: InvoiceType;
  subtotal: number;
  customsCode?: string;
  tax: number;
  withholding: number;
  total: number;
  totalInWords: string;
  createdAt: string;
}
