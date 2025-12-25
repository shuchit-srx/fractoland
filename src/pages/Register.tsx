import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Mail, Lock, ArrowLeft, User, Building2, Users, Eye, EyeOff, Phone, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";

const roleConfig = {
  user: {
    icon: User,
    title: "User Registration",
    description: "Create your account to start investing in fractional land ownership",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10 text-blue-600",
  },
  builder: {
    icon: Building2,
    title: "Builder Registration",
    description: "Join as a builder to manage development projects and land bids",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconBg: "bg-green-500/10 text-green-600",
  },
  agent: {
    icon: Users,
    title: "Agent Registration",
    description: "Become an agent and earn commissions by referring investors",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconBg: "bg-purple-500/10 text-purple-600",
  },
  owner: {
    icon: Building2,
    title: "Land Owner Registration",
    description: "Register as a land owner to list and manage your properties",
    gradient: "from-slate-500/20 to-zinc-500/20",
    iconBg: "bg-zinc-500/10 text-zinc-700",
  },
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "user";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const config = roleConfig[role];
  const Icon = config.icon;

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 1;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success("Registration successful! Welcome to FractoLand!");
        setTimeout(() => {
          navigate(`/dashboard/${role}`);
        }, 100);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${config.gradient} relative items-center justify-center p-12 overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent))_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a href="/" className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">FractoLand</span>
            </a>
            <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              Start Your Investment Journey
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join thousands of users, builders, and agents on the most trusted
              blockchain-powered land investment platform.
            </p>
            
            <div className="mt-12 space-y-4">
              {[
                "Blockchain-verified ownership",
                "Secure fiat transactions",
                "Government verified lands"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back button */}
          <motion.div
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button
              variant="ghost"
              className="mb-6 group"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Button>
          </motion.div>

          {/* Role indicator */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.iconBg} mb-6 cursor-default`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">{config.title}</span>
          </motion.div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create your account
          </h1>
          <p className="text-muted-foreground mb-6">{config.description}</p>

          {/* Switch role - Moved above form */}
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Register as different role:
            </p>
            <div className="flex gap-2 justify-center">
              {(["user", "builder", "agent", "owner"] as UserRole[]).map((r, index) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={r === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigate(`/register?role=${r}`)}
                    className="transition-all"
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{
                    color: focusedField === "name" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" />
                </motion.div>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-foreground">Email</label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{
                    color: focusedField === "email" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" />
                </motion.div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{
                    color: focusedField === "phone" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm transition-colors">+91</span>
                </motion.div>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className="pl-16 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span className={`${passwordStrength >= 3 ? "text-green-600" : passwordStrength >= 2 ? "text-yellow-600" : "text-red-600"}`}>
                      {passwordStrength >= 3 ? "Strong" : passwordStrength >= 2 ? "Medium" : "Weak"}
                    </span>
                  </motion.div>
                )}
              </div>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{
                    color: focusedField === "password" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" />
                </motion.div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(calculatePasswordStrength(e.target.value));
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={6}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.div
                        key={level}
                        className="h-1 flex-1 rounded-full bg-secondary"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: passwordStrength >= level ? 1 : 0,
                          backgroundColor:
                            passwordStrength >= 4
                              ? "hsl(142, 70%, 45%)"
                              : passwordStrength >= 3
                              ? "hsl(45, 93%, 47%)"
                              : passwordStrength >= 2
                              ? "hsl(38, 92%, 50%)"
                              : "hsl(0, 72%, 51%)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{
                    color: focusedField === "confirmPassword" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" />
                </motion.div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={6}
                />
                {confirmPassword && password === confirmPassword && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </motion.div>
                )}
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
              {confirmPassword && password !== confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-600"
                >
                  Passwords do not match
                </motion.p>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-12 text-base relative overflow-hidden"
                disabled={isLoading}
              >
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Creating account..." : "Create Account"}
                </span>
              </Button>
            </motion.div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(`/login?role=${role}`)}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

