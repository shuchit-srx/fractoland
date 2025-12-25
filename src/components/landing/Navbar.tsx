import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Menu, X, User, Building2, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "For Investors", href: "#investors" },
    { label: "For Builders", href: "#builders" },
    { label: "Trust & Security", href: "#trust" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">FractoLand</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  Sign In
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate("/login?role=user")} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  <span>User</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login?role=builder")} className="cursor-pointer">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Builder</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login?role=owner")} className="cursor-pointer">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Land Owner</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login?role=agent")} className="cursor-pointer">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Agent</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={() => navigate("/register?role=user")}>
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground px-2 mb-1">Sign In as:</p>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMobileMenuOpen(false); navigate("/login?role=user"); }}>
                    <User className="w-4 h-4 mr-2" />
                    User
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMobileMenuOpen(false); navigate("/login?role=builder"); }}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Builder
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMobileMenuOpen(false); navigate("/login?role=owner"); }}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Land Owner
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMobileMenuOpen(false); navigate("/login?role=agent"); }}>
                    <Users className="w-4 h-4 mr-2" />
                    Agent
                  </Button>
                </div>
                <Button size="sm" onClick={() => { setIsMobileMenuOpen(false); navigate("/register?role=user"); }}>
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
