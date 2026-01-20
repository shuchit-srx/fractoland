import { Button } from "@/components/ui/button";

const BuilderProfile = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Builder Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your company information, verification, bank details, and security preferences.
        </p>
      </div>

      {/* Company profile */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Company Profile</h2>
            <p className="text-xs text-muted-foreground">Basic builder identity and contact information.</p>
          </div>
          <Button size="sm" className="rounded-full h-9 px-4 text-sm">
            Edit Company Info
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Company Name</p>
            <p className="font-medium text-foreground">Skyline Constructions Pvt. Ltd.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Primary Contact Email</p>
            <p className="font-medium text-foreground">demo@builder.com</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone Number</p>
            <p className="font-medium text-foreground">+91 98765 11111</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Registered Role</p>
            <p className="font-medium text-foreground">Builder / Developer</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground">Registered Address</p>
            <p className="font-medium text-foreground">
              21/B Skyline Towers, Outer Ring Road, Bangalore, Karnataka - 560037
            </p>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
        <h2 className="text-lg font-semibold text-foreground">KYC &amp; Business Verification</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {[
            { label: "Company KYC", value: "Verified" },
            { label: "GST / PAN Verification", value: "Verified" },
            { label: "Director KYC", value: "Pending" },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-border rounded-xl p-3 flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>{item.label}</span>
              <span className="inline-flex px-2 py-1 rounded-full border border-border text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Verified builders get faster approvals on bids and smoother settlement processing.
        </p>
      </section>

      {/* Bank details */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Bank &amp; Payout Details</h2>
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
            <p className="font-medium text-foreground">Skyline Constructions Pvt. Ltd.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bank Name</p>
            <p className="font-medium text-foreground">FractoBank Ltd.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Number</p>
            <p className="font-medium text-foreground">XXXXXX5678</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">IFSC Code</p>
            <p className="font-medium text-foreground">FRAC0005678</p>
          </div>
        </div>
      </section>

      {/* Team & permissions */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Team &amp; Access</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="border border-border rounded-xl p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Admin</p>
            <p>Full access to bids, projects, and payments.</p>
          </div>
          <div className="border border-border rounded-xl p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Finance</p>
            <p>Can view payments and download statements.</p>
          </div>
          <div className="border border-border rounded-xl p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Project Manager</p>
            <p>Can track bids and project progress.</p>
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
    </div>
  );
};

export default BuilderProfile;
