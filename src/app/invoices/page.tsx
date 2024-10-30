"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ApiResponse } from "@/types/ApiResponse";

// interface Invoice {
//   Id: string;
//   Date: string;
//   InvoiceNumber: number;
//   CustomerName: string;
//   TotalAmount: number;
// }

// const invoices: Invoice[] = [
//   {
//     Id: "1",
//     Date: "2023-07-01",
//     InvoiceNumber: 1001,
//     CustomerName: "John Doe",
//     TotalAmount: 1000,
//   },
//   {
//     Id: "2",
//     Date: "2023-07-02",
//     InvoiceNumber: 1002,
//     CustomerName: "Jane Smith",
//     TotalAmount: 1500,
//   },
// ];

export default function InvoiceList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPages, setTotalPages] = useState(0);
//   const totalPages = Math.ceil(invoices.length / itemsPerPage);


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/invoice");
        await fetch("/api/invoice");
        let responseData: ApiResponse<Invoice[]> = await response.json();
        let data: Invoice[] = responseData.data;
        console.log("data", data);
        setInvoices(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);
  const handleRowClick = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/new">Add Invoice</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice:Invoice) => (
            <TableRow
              key={invoice.id}
              onClick={() => handleRowClick(invoice.id)}
              className="cursor-pointer"
            >
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(page > 1 ? page - 1 : page)}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page < totalPages ? page + 1 : page)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
