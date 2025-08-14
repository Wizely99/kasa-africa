"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  UserPlus,
  Pill,
  Package,
  ShoppingCart,
  MessageSquare,
  Heart,
  CalendarDays,
  Clock,
  Building2,
  FolderOpen,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Patients",
    href: "/admin/patients",
    icon: UserPlus,
  },
  {
    title: "Appointments",
    href: "/admin/my-appointments",
    icon: Calendar,
  },
  {
    title: "Schedule",
    href: "/admin/schedule",
    icon: CalendarDays,
  },
  // {
  //   title: "Book Appointment",
  //   href: "/admin/book-appointment",
  //   icon: Calendar,
  // },
  {
    title: "Medical Records",
    href: "/admin/medical-records",
    icon: FolderOpen,
  },
  {
    title: "Facility Availability",
    href: "/admin/facility-availability",
    icon: Clock,
  },
  {
    title: "Pharmacy",
    icon: Pill,
    children: [
      {
        title: "Products",
        href: "/admin/pharmacy/products",
        icon: Package,
      },
      {
        title: "Inventory",
        href: "/admin/pharmacy/inventory",
        icon: Package,
      },
      {
        title: "Orders",
        href: "/admin/pharmacy/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Forum Posts",
    href: "/admin/forum-post",
    icon: MessageSquare,
  },
  {
    title: "Health Tips",
    href: "/admin/health-tips",
    icon: Heart,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/admin">
          <Building2 className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {sidebarItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                          pathname === child.href
                            ? "bg-muted text-primary"
                            : "text-muted-foreground"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                  pathname === item.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden bg-transparent"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
