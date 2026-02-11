import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, HardHat, Loader2, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeveloperLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }
        setIsSendingOtp(true);
        setTimeout(() => {
            setIsSendingOtp(false);
            setIsOtpSent(true);
            toast.success("OTP sent successfully");
        }, 1500);
    };

    const handleVerifyOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        if (value.length === 6) {
            if (value === "123456") {
                setIsOtpVerified(true);
                toast.success("Verified successfully");
            } else {
                toast.error("Invalid OTP");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Force 'developer' role
            const success = await login(phone, "developer");
            if (success) {
                toast.success("Welcome back, Builder!");
                setTimeout(() => {
                    navigate("/dashboard/developer");
                }, 100);
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Branding - Construction Theme */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 relative items-center justify-center p-12 overflow-hidden">
                <div className="relative z-10 max-w-md">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <HardHat className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-foreground">FractoLand <span className="text-amber-600">Builder</span></span>
                        </div>
                        <h2 className="text-4xl font-bold text-foreground mb-4">
                            Construction Management <br /> & Bidding Portal
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            The exclusive gateway for verified developers to access land parcels, submit tenders, and manage project milestones.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <Button variant="ghost" className="px-0" onClick={() => navigate("/developer")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Portal
                    </Button>

                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider">
                            <HardHat className="w-3 h-3" /> Developer Access Only
                        </div>
                        <h1 className="text-3xl font-bold">Builder Login</h1>
                        <p className="text-muted-foreground">Enter your credentials to access the bidding dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mobile Number</label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Select value={countryCode} onValueChange={setCountryCode}>
                                        <SelectTrigger className="w-[100px] h-12">
                                            <SelectValue placeholder="+91" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 h-12"
                                            placeholder="98765 43210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={isOtpVerified}
                                        />
                                        {isOtpVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                                    </div>
                                </div>

                                {!isOtpVerified && (
                                    <Button type="button" variant="secondary" className="w-full h-11" onClick={handleSendOtp} disabled={isSendingOtp || isOtpSent || phone.length < 10}>
                                        {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : isOtpSent ? "OTP Sent" : "Send OTP"}
                                    </Button>
                                )}

                                {isOtpSent && !isOtpVerified && (
                                    <Input
                                        className="h-12 text-center text-lg tracking-widest"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        value={otp}
                                        onChange={handleVerifyOtp}
                                    />
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white" disabled={isLoading}>
                            {isLoading ? "Authenticating..." : "Access Dashboard"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            New to FractoLand? <a href="/developer/register" className="text-amber-600 hover:underline font-medium">Apply as a Builder</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeveloperLogin;