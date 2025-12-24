'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { cn } from '@/lib/utils';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthSelector() {
  const searchParams = useSearchParams();
  const currentMonthName = months[new Date().getMonth()];
  const selectedMonth = searchParams.get('month') || currentMonthName;

  return (
    <div className="p-2">
      <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">Select Month</p>
      <SidebarMenu>
        {months.map((month) => (
          <SidebarMenuItem key={month}>
            <Link href={`/?month=${month}`} className="w-full" passHref>
              <SidebarMenuButton
                isActive={selectedMonth === month}
                className={cn(
                  'w-full justify-start',
                  selectedMonth === month && 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                )}
                variant="ghost"
              >
                <Calendar className="h-4 w-4" />
                <span>{month}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
