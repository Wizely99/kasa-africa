"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LogOut,
  User,
  Settings,
  Heart,
  LucideIcon,
  Home,
  Calendar,
  Pill,
  FileText,
  ShoppingCart,
  Users,
  MessageSquare,
  BookOpen,
  BarChart3,
  UserPlus,
  Archive,
} from "lucide-react";
import Image from "next/image";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface UserInfo {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  initials: string;
}

export interface SidebarLayoutProps {
  children: React.ReactNode;
  navigation: NavigationGroup[];
  userInfo: UserInfo;
  appName: string;
  appSubtitle: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export function SidebarLayout({
  children,
  navigation,
  userInfo,
  appName,
  appSubtitle,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: SidebarLayoutProps) {
  const pathname = usePathname();

  const isActiveItem = (itemUrl: string) => {
    // Remove trailing slashes for consistent comparison
    const normalizedPathname = pathname.replace(/\/$/, "") || "/";
    const normalizedItemUrl = itemUrl.replace(/\/$/, "") || "/";

    // Exact match
    if (normalizedPathname === normalizedItemUrl) return true;

    // Check if current path starts with the item URL (for nested routes)
    if (
      normalizedItemUrl !== "/" &&
      normalizedPathname.startsWith(normalizedItemUrl + "/")
    ) {
      return true;
    }

    return false;
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-white text-primary-foreground ">
              <Image src="/logo.png" alt="App Logo" width={40} height={40} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{appName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {appSubtitle}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="scrollbar-hide overflow-y-auto">
          {navigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActiveItem(item.url)}
                        className={
                          isActiveItem(item.url)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={userInfo.avatarUrl}
                        alt={userInfo.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {userInfo.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userInfo.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userInfo.role}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userInfo.avatarUrl}
                          alt={userInfo.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {userInfo.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userInfo.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userInfo.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
