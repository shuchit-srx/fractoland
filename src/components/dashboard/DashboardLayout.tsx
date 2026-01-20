import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Bell, Briefcase, ChevronRight, FileText, Heart, Home, Link2, LogOut, MapPin, Menu, Users, Vote, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
}

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
    { icon: Heart, label: "Interested Lands", href: "/dashboard/user/wishlist" },
    { icon: Bell, label: "Notifications", href: "/dashboard/user/notifications" },
    { icon: Briefcase, label: "Profile", href: "/dashboard/user/profile" },
    // { icon: Wallet, label: "Wallet", href: "/dashboard/user/wallet" },
  ],

  agent: [
    { icon: Home, label: "Dashboard", href: "/dashboard/agent" },
    { icon: MapPin, label: "ExploreLands", href: "/dashboard/agent/explore" },
    { icon: Users, label: "Referrals", href: "/dashboard/agent/referrals" },
    { icon: Link2, label: "Referral Links", href: "/dashboard/agent/links" },
    { icon: Bell, label: "Notifications", href: "/dashboard/agent/notifications" },
    { icon: Briefcase, label: "Profile", href: "/dashboard/agent/profile" },
    // { icon: Wallet, label: "Earnings", href: "/dashboard/agent/earnings" },
  ],
  owner: [
    { icon: Home, label: "Dashboard", href: "/dashboard/owner" },
    { icon: MapPin, label: "My Lands", href: "/dashboard/owner/lands" },
    { icon: Vote, label: "Voting", href: "/dashboard/owner/voting" },
    { icon: FileText, label: "Developer Bids", href: "/dashboard/owner/bids" },
    { icon: Bell, label: "Notifications", href: "/dashboard/owner/notifications" },
    // { icon: Wallet, label: "Payments", href: "/dashboard/owner/payments" },
    { icon: Briefcase, label: "Profile", href: "/dashboard/owner/profile" },
  ]
};

const roleLabels: Record<UserRole, string> = {
  user: "Individual Investor",
  agent: "Real Estate Consultant",
  owner: "Property Owner",
};

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top of main content on route change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Check localStorage synchronously on first render as fallback
  const getLocalUser = (): User | null => {
    try {
      const stored = localStorage.getItem("fractoland_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const [localUser, setLocalUser] = useState<User | null>(getLocalUser);

  useEffect(() => {
    // Sync with localStorage changes
    const stored = localStorage.getItem("fractoland_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalUser(parsed);
      } catch (e) {
        // Invalid JSON, clear it
        localStorage.removeItem("fractoland_user");
        setLocalUser(null);
      }
    } else {
      setLocalUser(null);
    }
  }, []);

  // Sync localUser when context user updates
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  useEffect(() => {
    // If no user in context and no user in localStorage, redirect to login
    if (!user && !localUser) {
      navigate("/login");
    }
  }, [user, localUser, navigate]);

  // Use context user if available, otherwise fall back to localStorage user
  const currentUser = user || localUser;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Safety check: ensure role is valid
  const items = navItems[currentUser.role as UserRole] || navItems.user;

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === currentUser.role) return;

    try {
      // Simulate switching role by re-logging in with same phone but new role
      await login(currentUser.phone, newRole);
      toast.success(`Switched to ${roleLabels[newRole]}`);
      navigate(`/dashboard/${newRole}`);
    } catch (error) {
      toast.error("Failed to switch role");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <div className="fixed inset-0 w-full bg-secondary/30 flex overflow-hidden">
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
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-background border-r border-border flex flex-col z-40 transition-transform lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border flex-none">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FractoLand</span>
          </a>
        </div>

        {/* User info */}
        <div className="p-4 flex-none">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">{currentUser.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <Select value={currentUser.role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                <SelectTrigger className="h-8 w-full text-xs bg-background border-border text-foreground hover:bg-accent/50 transition-colors">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <SelectItem key={role} value={role} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {items.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
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
        <div className="p-4 border-t border-border flex-none">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main
        ref={mainContentRef}
        className="flex-1 h-full overflow-y-auto p-4 lg:p-8 lg:ml-0 mt-16 lg:mt-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto pb-6"
        >
          {children || <Outlet />}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
