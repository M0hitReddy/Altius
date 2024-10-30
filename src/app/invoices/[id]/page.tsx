'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from '@/components/ui/use-toast'
import { useToast } from '@/hooks/use-toast'

const itemSchema = z.object({
  Id: z.string(),
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be greater than 0'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  amount: z.number(),
})

const billSundrySchema = z.object({
  Id: z.string(),
  billSundryName: z.string().min(1, 'Bill sundry name is required'),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: 'Amount must be a valid number',
  }),
})

const invoiceSchema = z.object({
  Id: z.string(),
  Date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  InvoiceNumber: z.number().int().positive(),
  CustomerName: z.string().min(1, 'Customer name is required'),
  BillingAddress: z.string().min(1, 'Billing address is required'),
  ShippingAddress: z.string().min(1, 'Shipping address is required'),
  GSTIN: z.string().min(1, 'GSTIN is required'),
  Items: z.array(itemSchema).min(1, 'At least one item is required'),
  BillSundrys: z.array(billSundrySchema),
  TotalAmount: z.number(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

export default function InvoiceDetail({ params }: { params: { id: string } }) {
    const{toast} = useToast();
  const router = useRouter()
  const [isCreateMode, setIsCreateMode] = useState(params.id === 'new')

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      Id: '',
      Date: new Date().toISOString().split('T')[0],
      InvoiceNumber: 0,
      CustomerName: '',
      BillingAddress: '',
      ShippingAddress: '',
      GSTIN: '',
      Items: [{ Id: '1', itemName: '', quantity: 1, price: 0, amount: 0 }],
      BillSundrys: [],
      TotalAmount: 0,
    },
  })

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'Items',
  })

  const { fields: billSundryFields, append: appendBillSundry, remove: removeBillSundry } = useFieldArray({
    control,
    name: 'BillSundrys',
  })

  const watchItems = watch('Items')
  const watchBillSundrys = watch('BillSundrys')

  useEffect(() => {
    const totalItemsAmount = watchItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const totalBillSundrysAmount = watchBillSundrys.reduce((sum, billSundry) => sum + parseFloat(billSundry.amount || '0'), 0)
    setValue('TotalAmount', totalItemsAmount + totalBillSundrysAmount)
  }, [watchItems, watchBillSundrys, setValue])

  const onSubmit = (data: InvoiceFormData) => {
    console.log(data)
    toast({
      title: 'Invoice Saved',
      description: `Invoice ${data.InvoiceNumber} has been saved successfully.`,
    })
    router.push('/invoices')
  }

  const handleDelete = () => {
    // Implement delete logic here
    toast({
      title: 'Invoice Deleted',
      description: `Invoice has been deleted successfully.`,
    })
    router.push('/invoices')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{isCreateMode ? 'Create Invoice' : 'Update Invoice'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Date">Date</Label>
              <Input
                id="Date"
                type="date"
                {...register('Date')}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.Date && <p className="text-red-500">{errors.Date.message}</p>}
            </div>
            <div>
              <Label htmlFor="InvoiceNumber">Invoice Number</Label>
              <Input id="InvoiceNumber" type="number" {...register('InvoiceNumber', { valueAsNumber: true })} readOnly />
            </div>
          </div>
          <div>
            <Label htmlFor="CustomerName">Customer Name</Label>
            <Input id="CustomerName" {...register('CustomerName')} />
            {errors.CustomerName && <p className="text-red-500">{errors.CustomerName.message}</p>}
          </div>
          <div>
            <Label htmlFor="BillingAddress">Billing Address</Label>
            <Input id="BillingAddress" {...register('BillingAddress')} />
            {errors.BillingAddress && <p className="text-red-500">{errors.BillingAddress.message}</p>}
          </div>
          <div>
            <Label htmlFor="ShippingAddress">Shipping Address</Label>
            <Input id="ShippingAddress" {...register('ShippingAddress')} />
            {errors.ShippingAddress && <p className="text-red-500">{errors.ShippingAddress.message}</p>}
          </div>
          <div>
            <Label htmlFor="GSTIN">GSTIN</Label>
            <Input id="GSTIN" {...register('GSTIN')} />
            {errors.GSTIN && <p className="text-red-500">{errors.GSTIN.message}</p>}
          </div>
          <div>
            <Label>Items</Label>
            {itemFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 mb-2">
                <Input {...register(`Items.${index}.itemName`)} placeholder="Item Name" />
                <Input {...register(`Items.${index}.quantity`, { valueAsNumber: true })} placeholder="Quantity" type="number" min="1" />
                <Input {...register(`Items.${index}.price`, { valueAsNumber: true })} placeholder="Price" type="number" min="0.01" step="0.01" />
                <Input value={watchItems[index]?.quantity * watchItems[index]?.price || 0} readOnly placeholder="Amount" />
                <Button type="button" variant="destructive" onClick={() => removeItem(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendItem({ Id: '', itemName: '', quantity: 1, price: 0, amount: 0 })}>Add Item</Button>
          </div>
          <div>
            <Label>Bill Sundrys</Label>
            {billSundryFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 mb-2">
                <Input {...register(`BillSundrys.${index}.billSundryName`)} placeholder="Bill Sundry Name" />
                <Input {...register(`BillSundrys.${index}.amount`)} placeholder="Amount" type="number" step="0.01" />
                <Button type="button" variant="destructive" onClick={() => removeBillSundry(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendBillSundry({ Id: '', billSundryName: '', amount: '0' })}>Add Bill Sundry</Button>
          </div>
          <div>
            <Label htmlFor="TotalAmount">Total Amount</Label>
            <Input id="TotalAmount" {...register('TotalAmount', { valueAsNumber: true })} readOnly />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/invoices')}>Cancel</Button>
          <div>
            {!isCreateMode && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="mr-2">Delete</Button>
            )}
            <Button type="submit">Save</Button>
          </div>
        </CardFooter>
        </Card>
        </form>
        )
        }