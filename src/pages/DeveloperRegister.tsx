import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Building, HardHat, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeveloperRegister = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        phone: "",
        gstin: "",
        license: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise(r => setTimeout(r, 1000));

        try {
            // Force Developer Role
            await login(formData.phone || "9999999999", "developer");
            toast.success("Builder Application Submitted!");
            navigate("/dashboard/developer");
        } catch (e) {
            toast.error("Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Branding */}
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
                        {["Access pre-approved land parcels", "Guaranteed payment milestones", "Transparent smart contracts"].map(item => (
                            <li key={item} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                                <span className="text-zinc-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Form */}
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
                                <Input className="pl-10" placeholder="Acme Constructions Pvt Ltd"
                                    value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GSTIN</label>
                                <Input placeholder="GST Number" value={formData.gstin} onChange={e => setFormData({ ...formData, gstin: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">License No.</label>
                                <Input placeholder="RERA / Municipal ID" value={formData.license} onChange={e => setFormData({ ...formData, license: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input className="pl-10" type="email" placeholder="contracts@acme.com"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="98765 43210"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                        </div>

                        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 flex gap-3 items-start">
                            <ShieldCheck className="w-5 h-5 text-black mt-0.5" />
                            <p className="text-xs text-zinc-600">
                                Your account will undergo manual verification. You can bid on projects once your KYC and license are verified (approx. 24-48 hours).
                            </p>
                        </div>

                        <Button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Submit Application"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
import { CheckCircle2 } from "lucide-react"; // Import missing icon
export default DeveloperRegister;