"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export default function MonthSelector() {
    const searchParams = useSearchParams();
    const currentMonthName = months[new Date().getMonth()];
    const selectedMonth = searchParams.get("month") || currentMonthName;
    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();
    return (
        <div className="p-3">
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">
                Selecione o mês
            </p>
            <SidebarMenu>
                {months.map((month) => (
                    <SidebarMenuItem key={month}>
                        <Link
                            href={`/?month=${month}`}
                            className="w-full"
                            onClick={(e) => {
                                if (isMobile) {
                                    toggleSidebar();
                                }
                            }}
                        >
                            <SidebarMenuButton
                                isActive={selectedMonth === month}
                                className={cn(
                                    "w-full justify-start rounded-full px-5 ",
                                    selectedMonth === month &&
                                        "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500"
                                )}
                                variant="default"
                            >
                                {/* <Calendar className="h-4 w-4" /> */}
                                <span>{month}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
    );
}
