import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, LogOut, Home, Wallet, Vote, Users, Building2, Briefcase, Link2, FileText, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
}

const navItems: Record<UserRole, NavItem[]> = {
  user: [
    { icon: Home, label: "Dashboard", href: "/dashboard/user" },
    { icon: MapPin, label: "Explore Lands", href: "/dashboard/user/explore" },
    { icon: Briefcase, label: "Portfolio", href: "/dashboard/user/portfolio" },
    { icon: Vote, label: "Voting", href: "/dashboard/user/voting" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/user/wallet" },
  ],
  builder: [
    { icon: Home, label: "Dashboard", href: "/dashboard/builder" },
    { icon: MapPin, label: "Available Lands", href: "/dashboard/builder/lands" },
    { icon: FileText, label: "My Bids", href: "/dashboard/builder/bids" },
    { icon: Building2, label: "Projects", href: "/dashboard/builder/projects" },
  ],
  agent: [
    { icon: Home, label: "Dashboard", href: "/dashboard/agent" },
    { icon: Users, label: "Referrals", href: "/dashboard/agent/referrals" },
    { icon: Link2, label: "Referral Links", href: "/dashboard/agent/links" },
    { icon: Wallet, label: "Earnings", href: "/dashboard/agent/earnings" },
  ],
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const items = navItems[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-lg shadow-md border border-border"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`fixed lg:static w-72 h-full bg-background border-r border-border flex flex-col z-40 transition-transform lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FractoLand</span>
          </a>
        </div>

        {/* User info */}
        <div className="p-4">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">{user.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary" 
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto lg:ml-0 mt-16 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
