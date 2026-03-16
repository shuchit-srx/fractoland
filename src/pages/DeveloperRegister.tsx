import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getWalletSignature } from "@/lib/siwe";
import { ArrowLeft, Building, CheckCircle2, HardHat, Loader2, Mail, Phone, ShieldCheck, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeveloperRegister = () => {
  const navigate = useNavigate();
  const { sendOtp: sendOtpApi, checkOtp: checkOtpApi, verifyOtpAndRegisterDeveloper } = useAuth();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    gstin: "",
    license: "",
    name: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isCheckingOtp, setIsCheckingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletSignature, setWalletSignature] = useState<{ message: string; signature: string; address: string } | null>(null);
  const [isLinkingWallet, setIsLinkingWallet] = useState(false);

  const handleLinkWallet = async () => {
    setIsLinkingWallet(true);
    try {
      const result = await getWalletSignature("Sign in to FractoLand Builder to complete registration.");
      setWalletSignature(result);
      toast.success("Wallet ready. Submit to finish.");
    } catch (e) {
      if ((e as { code?: number }).code === 4001) {
        toast.error("Signature rejected");
      } else {
        toast.error(e instanceof Error ? e.message : "Failed to connect wallet");
      }
    } finally {
      setIsLinkingWallet(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsSendingOtp(true);
    try {
      const { devOtp } = await sendOtpApi(formData.phone, formData.countryCode, "register");
      setIsOtpSent(true);
      toast.success("OTP sent to your phone");
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
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) return;
    setIsCheckingOtp(true);
    setOtpError(null);
    try {
      const result = await checkOtpApi(formData.phone, sixDigitOtp, formData.countryCode, "register");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return toast.error("Company name required");
    if (!formData.email.trim()) return toast.error("Email required");
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) return toast.error("Valid phone required");
    if (!isOtpVerified || otp.length !== 6) return toast.error("Please enter and verify the 6-digit OTP sent to your phone");
    if (!walletSignature) return toast.error("Please connect and sign with your wallet to complete registration");

    setIsLoading(true);
    try {
      await verifyOtpAndRegisterDeveloper(formData.phone, otp, {
        company_name: formData.companyName.trim(),
        gstin: formData.gstin.trim() || undefined,
        license_number: formData.license.trim() || undefined,
        email: formData.email.trim(),
        name: formData.name.trim() || undefined,
        wallet_message: walletSignature.message,
        wallet_signature: walletSignature.signature,
      }, formData.countryCode);
      toast.success("Builder application submitted! Account pending verification.");
      navigate("/dashboard/developer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-black relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <HardHat className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold text-white">FractoLand <span className="text-zinc-400">Builder</span></span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Partner with the Best</h2>
          <ul className="space-y-4 mt-8">
            {["Access pre-approved land parcels", "Guaranteed payment milestones", "Transparent smart contracts"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                <span className="text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <Button variant="ghost" className="px-0" onClick={() => navigate("/developer")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div>
            <h1 className="text-3xl font-bold">Builder Registration</h1>
            <p className="text-muted-foreground">Register your construction firm to start bidding.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Acme Constructions Pvt Ltd"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GSTIN</label>
                <Input
                  placeholder="GST Number"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">License No.</label>
                <Input
                  placeholder="RERA / Municipal ID"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  type="email"
                  placeholder="contracts@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Name (optional)</label>
              <Input
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <div className="flex gap-2">
                <Select value={formData.countryCode} onValueChange={(v) => setFormData({ ...formData, countryCode: v })} disabled={isOtpVerified}>
                  <SelectTrigger className="w-[100px] h-11">
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
                    className={`pl-10 h-11 ${isOtpVerified ? "pr-10" : ""}`}
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isOtpSent || isOtpVerified}
                  />
                  {isOtpVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                </div>
              </div>
              {!isOtpSent && (
                <Button type="button" variant="secondary" className="w-full h-11" onClick={handleSendOtp} disabled={isSendingOtp || formData.phone.replace(/\D/g, "").length < 10}>
                  {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                </Button>
              )}
              {isOtpSent && !isOtpVerified && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Enter 6-digit OTP</label>
                  <Input
                    className={`h-11 text-center text-lg tracking-widest ${otpError ? "border-red-500 ring-2 ring-red-500/50 focus-visible:ring-red-500" : ""}`}
                    placeholder="000000"
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

            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-black dark:text-white mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Your account will undergo manual verification. You can bid on projects once your KYC and license are verified (approx. 24-48 hours). Email verification is required for account activation.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <WalletIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Link Wallet (required)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to complete registration. You can also use it to sign in later.
              </p>
              {walletSignature ? (
                <div className="flex items-center justify-between gap-4 p-3 bg-secondary/50 rounded-lg">
                  <code className="text-sm font-mono text-foreground">
                    {walletSignature.address.slice(0, 6)}...{walletSignature.address.slice(-4)}
                  </code>
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ready
                  </span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={handleLinkWallet}
                  disabled={isLinkingWallet || !isOtpVerified}
                >
                  {isLinkingWallet ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <WalletIcon className="w-4 h-4" />
                      Connect & sign wallet
                    </>
                  )}
                </Button>
              )}
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white" disabled={isLoading || !isOtpVerified || !walletSignature}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeveloperRegister;
