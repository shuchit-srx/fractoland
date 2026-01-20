import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, CreditCard, Lock, Shield, User } from "lucide-react";

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    const roleLabel = {
        user: "Individual Investor",
        agent: "Real Estate Consultant",
        owner: "Property Owner",
        builder: "Builder", // Legacy
    }[user.role] || user.role;

    const getVerificationItems = () => {
        const common = [{ label: "Identity Verification", value: "Verified" }];

        if (user.role === 'owner') {
            return [
                ...common,
                { label: "Land Ownership Verification", value: "Approved" },
                { label: "Government Authentication", value: "Verified" },
            ];
        } else if (user.role === 'agent') {
            return [
                ...common,
                { label: "RERA Registration", value: "Verified" },
                { label: "Agent License", value: "Active" },
            ];
        } else {
            // User
            return [
                ...common,
                { label: "KYC Compliance", value: "Completed" },
                { label: "PAN / Aadhaar", value: "Linked" },
            ];
        }
    };

    return (
        <div className="space-y-8 max-w-4xl pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account details, security, and verification status.
                </p>
            </div>

            {/* Profile info */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
                            <p className="text-xs text-muted-foreground">Your basic contact information.</p>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">
                        Edit
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium text-foreground text-base">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium text-foreground text-base">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Mobile Number</p>
                        <p className="font-medium text-foreground text-base">+91 {user.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Account Role</p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground text-base capitalize">{roleLabel}</p>
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                {user.role}
                            </span>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Address</p>
                        <p className="font-medium text-foreground">
                            {user.role === 'owner'
                                ? "123 Green Valley Road, Whitefield, Bangalore, Karnataka - 560066"
                                : "A-502, Prestige Towers, Jubilee Hills, Hyderabad, Telangana - 500033"
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Verification */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full">
                        <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Verification Status</h2>
                        <p className="text-xs text-muted-foreground">Compliance and identity checks.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {getVerificationItems().map((item) => (
                        <div
                            key={item.label}
                            className="bg-secondary/20 border border-border rounded-xl p-4 flex flex-col gap-2"
                        >
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-foreground text-sm">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bank details */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-full">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Bank & Payment</h2>
                            <p className="text-xs text-muted-foreground">Manage your linked accounts.</p>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">
                        Manage
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm bg-secondary/30 rounded-xl p-4 border border-border/50">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Account Holder</p>
                        <p className="font-medium text-foreground">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                        <p className="font-medium text-foreground">FractoBank Ltd.</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                        <p className="font-medium text-foreground">XXXXXX8899</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">IFSC Code</p>
                        <p className="font-medium text-foreground">FRAC0008899</p>
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-full">
                        <Lock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Login & Security</h2>
                        <p className="text-xs text-muted-foreground">Password and authentication settings.</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <Button variant="outline" className="rounded-xl h-10 text-sm justify-start px-4">
                        Change Password
                    </Button>
                    <Button variant="outline" className="rounded-xl h-10 text-sm justify-start px-4">
                        Enable 2FA
                    </Button>
                    <Button variant="outline" className="rounded-xl h-10 text-sm justify-start px-4">
                        Active Sessions
                    </Button>
                </div>
            </section>

            {/* Account actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-border">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
                    Terms & privacy Policy
                </Button>
                <div className="flex gap-4">
                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
