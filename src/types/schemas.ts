interface Invoice {
  id: string;
  date: string;
  invoiceNumber: number;
  customerName: string;
  billingAddress: string;
  shippingAddress: string;
  gstin: string;
  invoiceItems: InvoiceItem[];
  billSundries: InvoiceBillSundry[];
  totalAmount: number;
}

interface InvoiceItem {
  id: string;
  itemName: string;
  quantity: number;
  price: number;
  amount: number;
}

interface InvoiceBillSundry {
  id: string;
  billSundryName: string;
  amount: number;
}
