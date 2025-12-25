import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

const OwnerProfile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account details and verification information.
          </p>
        </div>

        {/* Profile info */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
              <p className="text-xs text-muted-foreground">Your basic contact and role details.</p>
            </div>
            <Button size="sm" className="rounded-full h-9 px-4 text-sm">
              Edit Profile
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-medium text-foreground">Lena Landowner</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-medium text-foreground">demo@owner.com</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mobile Number</p>
              <p className="font-medium text-foreground">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-medium text-foreground">Land Owner</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">
                123 Green Valley Road, Whitefield, Bangalore, Karnataka - 560066
              </p>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Verification</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {[
              { label: "Identity Verification", value: "Verified" },
              { label: "Land Ownership Verification", value: "Approved" },
              { label: "Government Authentication", value: "Verified" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-border rounded-xl p-3 flex items-center justify-between text-xs text-muted-foreground"
              >
                <span>{item.label}</span>
                <span className="inline-flex px-2 py-1 rounded-full border border-border text-foreground">
                  ✅ {item.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Verified profiles build trust and enable land tokenization.
          </p>
        </section>

        {/* Bank details */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Bank Details</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full h-9 px-4 text-sm">
                Add / Update
              </Button>
              <Button size="sm" className="rounded-full h-9 px-4 text-sm">
                Verify Account
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Account Holder Name</p>
              <p className="font-medium text-foreground">Lena Landowner</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bank Name</p>
              <p className="font-medium text-foreground">FractoBank Ltd.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-medium text-foreground">XXXXXX1234</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IFSC Code</p>
              <p className="font-medium text-foreground">FRAC0001234</p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <Button variant="outline" className="rounded-full h-9 text-sm">
              Change Password
            </Button>
            <Button variant="outline" className="rounded-full h-9 text-sm">
              Enable Two-Factor Auth
            </Button>
            <Button variant="outline" className="rounded-full h-9 text-sm">
              Manage Login Sessions
            </Button>
          </div>
        </section>

        {/* Legal */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Legal</h2>
          <div className="flex flex-col gap-2 text-sm text-foreground underline">
            <a href="#" className="hover:text-muted-foreground">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-muted-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-muted-foreground">Platform Agreement</a>
          </div>
        </section>

        {/* Account actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <Button variant="outline" className="rounded-full h-9 px-5 text-sm">
            Logout
          </Button>
          <Button variant="ghost" className="h-9 px-5 text-sm text-red-600">
            Request Account Deactivation
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerProfile;


