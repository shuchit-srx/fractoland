import { Button } from "@/components/ui/button";
import { FileText, MapPin } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const ownerLands = [
  {
    id: 1,
    name: "Green Valley Hills",
    ref: "GVH-001",
    location: "Whitefield, Bangalore",
    area: "2.5 Acres",
    status: "Live for Investment",
    tokens: 2000,
    tokensSold: 1650,
    investors: 42,
    lockIn: "18 months",
    lockInEnd: "12 Dec 2026",
    votingDate: "15 Dec 2026",
  },
  {
    id: 2,
    name: "Skyline Meadows",
    ref: "SKY-014",
    location: "Hyderabad, Telangana",
    area: "1.8 Acres",
    status: "Voting in Progress",
    tokens: 1500,
    tokensSold: 1500,
    investors: 37,
    lockIn: "24 months",
    lockInEnd: "03 Aug 2026",
    votingDate: "04 Aug 2026",
  },
  {
    id: 3,
    name: "Urban Crest",
    ref: "URC-009",
    location: "Outer Ring Road, Chennai",
    area: "3.1 Acres",
    status: "Under Verification",
    tokens: 1200,
    tokensSold: 0,
    investors: 0,
    lockIn: "12 months",
    lockInEnd: "-",
    votingDate: "-",
  },
];

const OwnerLandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [search] = useSearchParams();
  const activeTab = search.get("tab") === "docs" ? "docs" : "overview";

  const land = ownerLands.find((l) => l.id === Number(id));

  if (!land) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Land not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
          Land Details
        </p>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {land.name}
          <span className="text-xs font-normal text-muted-foreground">({land.ref})</span>
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {land.location} • {land.area}
        </p>
      </div>

      {/* Simple tabs */}
      <div className="flex gap-2 text-xs border-b border-border">
        <button
          className={`px-3 pb-2 ${activeTab === "overview"
              ? "text-foreground border-b-2 border-foreground font-medium"
              : "text-muted-foreground"
            }`}
        >
          Overview
        </button>
        <button
          className={`px-3 pb-2 ${activeTab === "docs"
              ? "text-foreground border-b-2 border-foreground font-medium"
              : "text-muted-foreground"
            }`}
        >
          Documents
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-4">
          <section className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-card text-sm">
            <h2 className="text-sm font-semibold text-foreground">Tokenization & investment</h2>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div>
                <p>Total tokens</p>
                <p className="font-semibold text-foreground">
                  {land.tokens.toLocaleString()}
                </p>
              </div>
              <div>
                <p>Tokens sold</p>
                <p className="font-semibold text-foreground">
                  {land.tokensSold.toLocaleString()}
                </p>
              </div>
              <div>
                <p>Investors</p>
                <p className="font-semibold text-foreground">{land.investors}</p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-card text-sm">
            <h2 className="text-sm font-semibold text-foreground">Lock-in & voting</h2>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div>
                <p>Lock-in period</p>
                <p className="font-semibold text-foreground">{land.lockIn}</p>
              </div>
              <div>
                <p>Lock-in ends</p>
                <p className="font-semibold text-foreground">{land.lockInEnd}</p>
              </div>
              <div>
                <p>Voting eligible from</p>
                <p className="font-semibold text-foreground">{land.votingDate}</p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-card text-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Documents</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-full">
              <FileText className="w-3 h-3 mr-1" />
              Upload / Manage Docs
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is a placeholder view. In a full implementation you can list RTC, Patta, EC, tax
            receipts and other verified documents here.
          </p>
        </section>
      )}
    </div>
  );
};

export default OwnerLandDetail;
