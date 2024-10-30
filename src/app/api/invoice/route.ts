// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

const validateInvoiceItem = (item: InvoiceItem) => {
  console.log("item", item);
  if (item.quantity <= 0 || item.price <= 0 || item.amount <= 0) {
    throw new Error("Quantity, Price, and Amount must be greater than zero.");
  }
  if (item.amount !== item.quantity * item.price) {
    throw new Error("Amount must be equal to Quantity x Price.");
  }
};

const validateInvoice = (invoice: Invoice) => {
  let totalItemsAmount = 0;
  let totalSundryAmount = 0;

  invoice.invoiceItems.forEach((item) => validateInvoiceItem(item));
  totalItemsAmount = invoice.invoiceItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  console.log("invoice", invoice.invoiceItems);
  totalSundryAmount = invoice.billSundries.reduce(
    (sum, sundry) => sum + sundry.amount,
    0
  );

  if (invoice.totalAmount !== totalItemsAmount + totalSundryAmount) {
    throw new Error(
      "TotalAmount must be equal to the sum of InvoiceItems and BillSundries amounts."
    );
  }
};

import prisma from "@/lib/dbConnect";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        invoiceItems: true,
        billSundries: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fetched successfully",
      data: invoice,
    });
  }
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        invoiceItems: true,
        billSundries: true,
      },
    });
    // console.log("categories", categories);
    return NextResponse.json({
      success: true,
      message: "Fetched successfully",
      data: invoices,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const invoice = await req.json();

    console.log("invoice", invoice);
    validateInvoice(invoice);

    const createdInvoice = await prisma.invoice.create({
      data: {
        ...invoice,

        invoiceItems: {
          create: invoice.invoiceItems,
        },
        // invoiceItems: {
        //   create: invoice.invoiceItems,
        // },

        billSundries: {
          create: invoice.billSundries,
        },
      },
    });
    // await prisma.billSundry.createMany({
    //   data: invoice.billSundries,
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice created successfully",
        data: createdInvoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "failed to create invoice" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "failed to delete invoice" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  console.log("PUT");
  try {
    const invoice = await req.json();
    console.log("invoice", invoice);
    const id = invoice.id;
    validateInvoice(invoice);
    console.log("invoice", invoice);

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...invoice,
        invoiceItems: {
          deleteMany: {},
          create: invoice.invoiceItems,
        },
        billSundries: {
          deleteMany: {},
          create: invoice.billSundries,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice updated successfully",
        data: updatedInvoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "failed to update invoice" },
      { status: 400 }
    );
  }
}
