import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, FileText, MapPin, TrendingUp, Users, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const bidDetails = [
  {
    id: 1,
    land: "Tech Park Zone D",
    location: "Hyderabad, Telangana",
    amount: "₹3,50,00,000",
    status: "pending",
    deadline: "30 days",
    rank: 2,
    totalBids: 4,
    submittedOn: "Dec 10, 2024",
    notes:
      "You are currently ranked #2 out of 4 bids. Increasing your bid or attaching a stronger project plan may improve your chances.",
  },
  {
    id: 4,
    land: "Industrial Zone A",
    location: "Bangalore, Karnataka",
    amount: "₹2,80,00,000",
    status: "pending",
    deadline: "15 days",
    rank: 3,
    totalBids: 8,
    submittedOn: "Dec 12, 2024",
    notes:
      "There are multiple competing offers on this land. Watch the deadline and consider revising your bid if needed.",
  },
  {
    id: 5,
    land: "Residential Block C",
    location: "Pune, Maharashtra",
    amount: "₹2,00,00,000",
    status: "outbid",
    deadline: "22 days",
    rank: 4,
    totalBids: 5,
    submittedOn: "Dec 8, 2024",
    notes:
      "You have been outbid on this land. You can increase your bid before the deadline or look for alternative lands.",
  },
  {
    id: 3,
    land: "Metro Hub F",
    location: "Chennai, Tamil Nadu",
    amount: "₹5,00,00,000",
    status: "rejected",
    deadline: "-",
    rank: 4,
    totalBids: 8,
    submittedOn: "Nov 15, 2024",
    notes: "A higher bid from another developer was accepted for this land.",
    rejectionReason: "Higher bid accepted from another developer",
  },
];

const statusConfig = {
  pending: { color: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock, label: "Pending" },
  approved: { color: "bg-green-50 text-green-600 border-green-200", icon: CheckCircle, label: "Approved" },
  rejected: { color: "bg-red-50 text-red-600 border-red-200", icon: XCircle, label: "Rejected" },
  outbid: { color: "bg-orange-50 text-orange-600 border-orange-200", icon: AlertCircle, label: "Outbid" },
};

const BuilderBidDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);
  const bid = bidDetails.find((b) => b.id === numericId);

  if (!bid) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard/builder/bids")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Bids
        </Button>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Bid not found.</p>
        </div>
      </div>
    );
  }

  const config = statusConfig[bid.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/dashboard/builder/bids")} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Bid Details</h1>
          <p className="text-muted-foreground mt-1">Review the details of your bid for this land opportunity</p>
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-border bg-secondary/30">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{bid.land}</h2>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${config.color}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{bid.location}</span>
              </div>
            </div>
            {bid.status === "outbid" && (
              <Button className="rounded-full">
                Increase Bid
              </Button>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Your Bid</p>
              </div>
              <p className="text-xl font-bold text-foreground">{bid.amount}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Your Rank</p>
              </div>
              <p className="text-xl font-bold text-foreground">#{bid.rank} of {bid.totalBids}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Submitted</p>
              </div>
              <p className="text-lg font-semibold text-foreground">{bid.submittedOn}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Deadline</p>
              </div>
              <p className="text-lg font-semibold text-foreground">{bid.deadline}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Information
              </h3>
              <div className="bg-secondary/30 rounded-xl p-4">
                <p className="text-sm text-foreground leading-relaxed">{bid.notes}</p>
              </div>
            </div>

            {bid.rejectionReason && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Rejection Reason
                </h3>
                <div className="bg-red-50/50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{bid.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/builder/bids")}
          className="rounded-full flex-1"
        >
          Back to My Bids
        </Button>
        {bid.status === "pending" && (
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/builder/lands")}
            className="rounded-full flex-1"
          >
            Browse More Lands
          </Button>
        )}
      </div>
    </div>
  );
};

export default BuilderBidDetail;
