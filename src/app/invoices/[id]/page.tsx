"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

export default function InvoiceDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

//   const [isEditing, setIsEditing] = useState(false);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        // console.log(":::::", params.id)
        const response = await fetch(`/api/invoice?id=${params.id}`);
        // console.log(await response.json())
        // if (response.ok) {
        const fetchedData: ApiResponse<Invoice> = await response.json();
        //   console.log(":::::", fetchedData)
        setInvoice(fetchedData.data);
        // } else {
        //   throw new Error('Failed to fetch invoice')
        // }
      } catch (error) {
        console.log(":::::", error);
        toast({
          title: "Error",
          description: "Failed to fetch invoice. Please try again.",
          variant: "destructive",
        });
        // router.push('/invoices')
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    console.log(":::::", index, field, value);
    let quantity = invoice ? Number(invoice.invoiceItems[index].quantity) : 0;
    let price = invoice ? Number(invoice.invoiceItems[index].price) : 0;
    // if (field === "quantity") {
    //   quantity = Number(value);
    //   // console.log(":::::", value)
    // } else if (field === "price") {
    //   price = Number(value);
    // }
    setInvoice((prev) => {
      if (!prev) return null;
      console.log(":::::", prev);
      console.log(
        prev.invoiceItems[index].quantity * prev.invoiceItems[index].price
      );
      const updatedItem = {
        ...prev.invoiceItems[index],
        [field]: value,
        amount:
          field === "quantity" ? Number(value) * price : quantity * Number(value),
      };
      const updatedItems = prev.invoiceItems.map((item, i) =>
        i === index ? updatedItem : item
      );
      const updatedTotalAmount = updatedItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
      return {
        ...prev,
        invoiceItems: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    });
  };

  const handleBillSundryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setInvoice((prev) => {
      if (!prev) return null;
      //   const updatedBillSundry = { ...prev.billSundries[index], [field]: value };
      //   const updatedTotalAmount = prev.invoiceItems.reduce(
      //     (total, item) => total + item.quantity * item.price,
      //     0
      //   ) + prev.billSundries.reduce(
      //     (total, sundry) => total + parseFloat(sundry.amount.toString()),
      //     0
      //   );
      const updatedBillSundrys = prev.billSundries.map((sundry, i) =>
        i === index ? { ...sundry, [field]: value } : sundry
      );
      return { ...prev, billSundries: updatedBillSundrys };
    });
  };

  const addItem = () => {
    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: [
          ...prev.invoiceItems,
          { id: Date.now().toString(), itemName: "", quantity: 1, price: 0 },
        ],
      };
    });
  };

  const addBillSundry = () => {
    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        billSundrys: [
          ...prev.billSundries,
          { id: Date.now().toString(), billSundryName: "", amount: "0" },
        ],
      };
    });
  };

  const removeItem = (index: number) => {
    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.invoiceItems.filter((_, i) => i !== index),
      };
    });
  };

  const removeBillSundry = (index: number) => {
    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        billSundrys: prev.billSundries.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    try {
      const response = await fetch(`/api/invoice`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });
      console.log(":::::", await response.json());
      //   if (response.ok) {
      toast({
        title: "Invoice Updated",
        description: "Your invoice has been updated successfully.",
      });
      //   router.push("/invoices");
      //   } else {
      //     throw new Error('Failed to update invoice')
      //   }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;

    try {
      const response = await fetch(`/api/invoice/${invoice.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "Invoice Deleted",
          description: "Your invoice has been deleted successfully.",
        });
        router.push("/invoices");
      } else {
        throw new Error("Failed to delete invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="container mx-auto py-10">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={invoice.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={invoice.invoiceNumber}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={invoice.customerName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  name="gstin"
                  value={invoice.gstin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input
                id="billingAddress"
                name="billingAddress"
                value={invoice.billingAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Input
                id="shippingAddress"
                name="shippingAddress"
                value={invoice.shippingAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-4">
              <Label>Items</Label>
              {invoice.invoiceItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-5 gap-2 items-end">
                  <div className="col-span-2">
                    <Label htmlFor={`itemName-${index}`}>Item Name</Label>
                    <Input
                      id={`itemName-${index}`}
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addItem}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              <Label>Bill Sundrys</Label>
              {invoice.billSundries.map((sundry, index) => (
                <div
                  key={sundry.id}
                  className="grid grid-cols-3 gap-2 items-end"
                >
                  <div>
                    <Label htmlFor={`billSundryName-${index}`}>Name</Label>
                    <Input
                      id={`billSundryName-${index}`}
                      value={sundry.billSundryName}
                      onChange={(e) =>
                        handleBillSundryChange(
                          index,
                          "billSundryName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <Input
                      id={`amount-${index}`}
                      type="number"
                      value={sundry.amount}
                      onChange={(e) =>
                        handleBillSundryChange(index, "amount", e.target.value)
                      }
                      step="0.01"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeBillSundry(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addBillSundry}>
                Add Bill Sundry
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                value={invoice.totalAmount}
                readOnly
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/invoices")}
            >
              Cancel
            </Button>
            <div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-2"
              >
                Delete
              </Button>
              <Button type="submit">Update Invoice</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
