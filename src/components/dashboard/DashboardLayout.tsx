import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, LogOut, Home, Wallet, FileText, Vote, Users, Building2, Briefcase, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
}

const navItems: Record<UserRole, NavItem[]> = {
  investor: [
    { icon: Home, label: "Dashboard", href: "/dashboard/investor" },
    { icon: MapPin, label: "Explore Lands", href: "/dashboard/investor/explore" },
    { icon: Briefcase, label: "Portfolio", href: "/dashboard/investor/portfolio" },
    { icon: Vote, label: "Voting", href: "/dashboard/investor/voting" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/investor/wallet" },
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

  if (!user) {
    navigate("/login");
    return null;
  }

  const items = navItems[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-card border-r border-border p-6 flex flex-col"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">FractoLand</span>
        </a>

        {/* User info */}
        <div className="mb-8 p-4 bg-secondary rounded-xl">
          <p className="font-semibold text-foreground text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
            {user.role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {items.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => navigate(item.href)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
