import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Tags,
  Award,
  ChevronRight,
  Shield
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/brands", label: "Brands", icon: Award },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <>
      <div className="p-6 border-b border-zinc-200">
        <div className={`flex items-center bg-zinc-100 rounded-2xl p-3 border border-zinc-200 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="p-1.5 bg-zinc-100 rounded-lg shrink-0">
            <Shield className="h-5 w-5 text-black" />
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <h2 className="text-sm font-bold text-black tracking-widest uppercase font-serif truncate">Admin Panel</h2>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest truncate">Management Panel</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setIsMobileOpen(false)}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg transition-colors cursor-pointer ${
                collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                isActive
                  ? "bg-zinc-100 text-black font-medium shadow-sm"
                  : "text-zinc-500 hover:text-black hover:bg-zinc-100"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-zinc-200 space-y-1.5">
        <button
          onClick={() => navigate("/")}
          title={collapsed ? "Back to Store" : undefined}
          className={`flex items-center w-full rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 text-sm'
          }`}
        >
          <ChevronLeft className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Back to Store</span>}
        </button>
        
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-zinc-100 transition-colors cursor-pointer ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 text-sm'
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 text-black rounded-lg cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Top Header Branding */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-200 z-40 flex items-center pl-[60px] pr-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-100 rounded-lg shrink-0">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-black tracking-widest uppercase font-serif leading-none">Aura Admin</h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5 leading-none">Management Panel</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white flex flex-col transform transition-transform duration-300 ease-in-out shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-black bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent collapsed={false} />
      </aside>

      {/* Desktop sidebar */}
      <aside 
        className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out relative ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 p-1 bg-zinc-100 border border-zinc-300 text-zinc-500 hover:text-black rounded-full cursor-pointer z-10 transition-colors shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <SidebarContent collapsed={isCollapsed} />
      </aside>
    </>
  );
}
