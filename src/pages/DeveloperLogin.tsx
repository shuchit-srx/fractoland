import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getWalletSignature } from "@/lib/siwe";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, HardHat, Loader2, MapPin, Phone, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeveloperLogin = () => {
    const navigate = useNavigate();
    const { sendOtp: sendOtpApi, checkOtp: checkOtpApi, verifyOtpAndLogin, loginWithWallet } = useAuth();

    const [phone, setPhone] = useState("");
    const [isWalletLogin, setIsWalletLogin] = useState(false);
    const [countryCode, setCountryCode] = useState("+91");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [isCheckingOtp, setIsCheckingOtp] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }
        setIsSendingOtp(true);
        try {
            const { devOtp } = await sendOtpApi(phone, countryCode, "login");
            setIsOtpSent(true);
            toast.success("OTP sent successfully");
            if (devOtp) toast.info(`Dev OTP: ${devOtp}`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to send OTP");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
        setOtpError(null);
        if (value.length === 6 && !isOtpVerified) {
            verifyOtpWhenComplete(value);
        }
    };

    const verifyOtpWhenComplete = async (sixDigitOtp: string) => {
        if (!phone.trim() || phone.replace(/\D/g, "").length < 10) return;
        setIsCheckingOtp(true);
        setOtpError(null);
        try {
            const result = await checkOtpApi(phone, sixDigitOtp, countryCode, "login");
            if (result.valid) {
                setIsOtpVerified(true);
                setOtpError(null);
                toast.success("Phone number verified");
            } else {
                setOtpError(result.error || "Invalid OTP");
            }
        } catch {
            setOtpError("Could not verify OTP. Try again.");
        } finally {
            setIsCheckingOtp(false);
        }
    };

    const handleWalletLogin = async () => {
        setIsWalletLogin(true);
        try {
            const { message, signature } = await getWalletSignature("Sign in to FractoLand Builder.");
            await loginWithWallet(message, signature);
            toast.success("Welcome back, Builder!");
            navigate("/dashboard/developer");
        } catch (e) {
            if ((e as { code?: number }).code === 4001) {
                toast.error("Signature rejected");
            } else {
                toast.error(e instanceof Error ? e.message : "Login with wallet failed. Register first and link your wallet.");
            }
        } finally {
            setIsWalletLogin(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }
        if (!isOtpVerified || otp.length !== 6) {
            toast.error("Please enter and verify the 6-digit OTP sent to your phone");
            return;
        }
        setIsLoading(true);
        try {
            await verifyOtpAndLogin(phone, otp, countryCode);
            toast.success("Welcome back, Builder!");
            navigate("/dashboard/developer");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Branding - Construction Theme */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative items-center justify-center p-12 overflow-hidden">
                <div className="relative z-10 max-w-md">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <HardHat className="w-7 h-7 text-black" />
                            </div>
                            <span className="text-3xl font-bold text-white">FractoLand <span className="text-zinc-400">Builder</span></span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Construction Management <br /> & Bidding Portal
                        </h2>
                        <p className="text-zinc-400 text-lg">
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider">
                            <HardHat className="w-3 h-3" /> Developer Access Only
                        </div>
                        <h1 className="text-3xl font-bold">Builder Login</h1>
                        <p className="text-muted-foreground">Enter your credentials to access the bidding dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 text-base"
                            onClick={handleWalletLogin}
                            disabled={isWalletLogin}
                        >
                            {isWalletLogin ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <WalletIcon className="w-4 h-4" />
                                    Sign in with wallet
                                </>
                            )}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-background px-4 text-muted-foreground">Or sign in with phone</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mobile Number</label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Select value={countryCode} onValueChange={setCountryCode} disabled={isOtpVerified}>
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
                                            className={`pl-10 h-12 ${isOtpVerified ? "pr-10" : ""}`}
                                            placeholder="98765 43210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={isOtpSent || isOtpVerified}
                                        />
                                        {isOtpVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                                    </div>
                                </div>

                                {!isOtpSent && (
                                    <Button type="button" variant="secondary" className="w-full h-11" onClick={handleSendOtp} disabled={isSendingOtp || phone.replace(/\D/g, "").length < 10}>
                                        {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                                    </Button>
                                )}

                                {isOtpSent && !isOtpVerified && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground">Enter 6-digit OTP</label>
                                        <Input
                                            className={`h-12 text-center text-lg tracking-widest ${otpError ? "border-red-500 ring-2 ring-red-500/50 focus-visible:ring-red-500" : ""}`}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            value={otp}
                                            onChange={handleOtpChange}
                                            disabled={isCheckingOtp}
                                        />
                                        {isCheckingOtp && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                                            </p>
                                        )}
                                        {otpError && (
                                            <p className="text-sm text-red-600 font-medium">{otpError}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-black hover:bg-zinc-800 text-white" disabled={isLoading || !isOtpVerified}>
                            {isLoading ? "Authenticating..." : "Access Dashboard"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            New to FractoLand? <a href="/developer/register" className="text-black hover:underline font-medium">Apply as a Builder</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeveloperLogin;