import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BuilderNotifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Alerts for new lands, bid status changes, payments, and sale completion.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Notification Center</h2>
          <p className="text-sm text-muted-foreground">
            This is a placeholder. Surface real-time updates for new bidding opportunities, bid
            decisions, payment reminders, and completed sales here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuilderNotifications;


