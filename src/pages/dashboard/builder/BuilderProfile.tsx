import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BuilderProfile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile &amp; Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage company details, verification, bank info, and security settings.
          </p>
        </div>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Company Profile</h2>
          <p className="text-sm text-muted-foreground">
            Placeholder for company name, contact email, phone, and address.
          </p>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">KYC &amp; Business Verification</h2>
          <p className="text-sm text-muted-foreground">
            Show verification status for business documents and director IDs.
          </p>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Bank Details</h2>
          <p className="text-sm text-muted-foreground">
            Add/update settlement account and verification status.
          </p>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="text-sm text-muted-foreground">
            Options for password change, two-factor auth, and session management.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default BuilderProfile;


