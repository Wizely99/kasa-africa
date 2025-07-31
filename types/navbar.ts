export type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  export interface NavSection {
    readonly title: string;
    readonly items: ReadonlyArray<NavItem>;
  }
  
  export interface SidebarNavProps {
    readonly className?: string;
    readonly isCollapsed: boolean;
    readonly navSections: ReadonlyArray<NavSection>;
  
    onMobileClose?: () => void;
  }
  