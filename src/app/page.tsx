'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[200px] sm:w-[240px]">
          <nav className="flex flex-col space-y-2">
            <Link href="/invoices" className={`p-2 ${pathname === '/invoices' ? 'bg-secondary' : ''}`}>
              Invoices
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:flex flex-col w-64 bg-background border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold">Invoice App</h1>
        </div>
        <Link href="/invoices" className={`p-2 ${pathname === '/invoices' ? 'bg-secondary' : ''}`}>
          Invoices
        </Link>
      </nav>
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  )
}