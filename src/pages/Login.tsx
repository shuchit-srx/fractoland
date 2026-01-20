import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, CheckCircle2, Loader2, MapPin, Phone, User, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const roleConfig = {
  user: {
    icon: User,
    title: "Individual Login",
    description: "Access your investment portfolio and explore land opportunities",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10 text-blue-600",
  },
  agent: {
    icon: Users,
    title: "Realestate Consultant Login",
    description: "Track your referrals and manage earnings",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconBg: "bg-purple-500/10 text-purple-600",
  },
  owner: {
    icon: Building2,
    title: "Property Owner Login",
    description: "Manage your listed lands, tokens, and exit requests",
    gradient: "from-slate-500/20 to-zinc-500/20",
    iconBg: "bg-zinc-500/10 text-zinc-700",
  },
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "user";
  const userType = searchParams.get("userType") || "individual";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const config = roleConfig[role];

  // Dynamic config override for Organization
  if (role === "user" && userType === "organization") {
    config.title = "Organization Login";
    config.description = "Access your organization's investment portfolio and manage assets";
  }

  const Icon = config.icon;

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsSendingOtp(true);
    // Simulate API call
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      toast.success("OTP sent successfully to your phone");
    }, 1500);
  };

  const handleVerifyOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (value.length === 6) {
      if (value === "123456") {
        setIsOtpVerified(true);
        toast.success("Phone number verified successfully");
      } else {
        toast.error("Invalid OTP. Try 123456");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // DEMO MODE: Bypass OTP and Phone validation for easy access
    const loginPhone = phone.trim() || "9999999999";

    setIsLoading(true);

    try {
      const success = await login(loginPhone, role);
      if (success) {
        toast.success("Login successful!");
        // Wait a bit to ensure state is updated
        setTimeout(() => {
          navigate(`/dashboard/${role}`);
        }, 100);
      }
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
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
              Fractional Land Ownership Made Simple
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

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="px-0 group" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => navigate("/register")}>
              Create account
            </Button>
          </div>

          {/* Role indicator */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.iconBg}`}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{config.title}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">{config.description}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Login as different role:</p>
            <div className="flex gap-2">
              {(["user", "agent", "owner"] as UserRole[]).map((r, index) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant={r === role ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/login?role=${r}${r === 'user' ? `&userType=${userType}` : ''}`)}
                  >
                    {r === "user" ? (userType === "organization" ? "Organization" : "Individual") : r === "agent" ? "Consultant" : "Owner"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Phone & OTP */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-[100px]">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="h-12 px-3 flex items-center">
                        <SelectValue placeholder="+91" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+971">🇦🇪 +971</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                    </div>

                    <Input
                      className="pl-10 h-12"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isOtpVerified}
                    />

                    {isOtpVerified && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>


                {!isOtpVerified && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-11"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || isOtpSent || phone.length < 10}
                  >
                    {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : isOtpSent ? "OTP Sent" : "Send OTP"}
                  </Button>
                )}

                {isOtpSent && !isOtpVerified && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-2 pt-2"
                  >
                    <label className="text-xs text-muted-foreground">Enter 6-digit OTP (Try: 123456)</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="h-12 text-center text-lg tracking-widest"
                      value={otp}
                      onChange={handleVerifyOtp}
                    />
                  </motion.div>
                )}
              </div>
            </div>

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
                  {isLoading ? "Please wait..." : "Sign In"}
                </span>
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button variant="outline" className="h-11 relative" onClick={() => toast.info("Social login simulated")}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-11 relative" onClick={() => toast.info("Social login simulated")}>
                <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24" >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.77.59 3.54 1.77-3.1 1.83-2.69 5.66.52 7.02-.34.97-.8 1.93-1.42 2.91-1.07 1.76-2.2 3.49-3.23 3.44zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Apple
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(`/register?role=${role}&userType=${userType}`)}
                className="text-primary hover:underline font-medium"
              >
                Create one
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
