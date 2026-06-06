import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Users,
  Building2,
  Tags,
  FileText,
  MessageSquare,
  CheckSquare,
  Bell,
  ShoppingCart,
  Receipt,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] },
  { name: 'Vendors', href: '/vendors', icon: Building2, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] },
  { name: 'My Profile', href: '/vendor-profile', icon: Building2, roles: ['VENDOR'] },
  { name: 'Categories', href: '/categories', icon: Tags, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { name: 'RFQs', href: '/rfqs', icon: FileText, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] },
  { name: 'Quotations', href: '/quotations', icon: MessageSquare, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] },
  { name: 'Approvals', href: '/approvals', icon: CheckSquare, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR'] },
  { name: 'Invoices', href: '/invoices', icon: Receipt, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR'] },
  { name: 'Reports', href: '/reports', icon: PieChart, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => user?.role && item.roles.includes(user.role));

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out h-full",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            VB
          </div>
          {!collapsed && <span className="text-xl tracking-tight">VendorBridge</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  );
}
