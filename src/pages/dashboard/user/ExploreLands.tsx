import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVentures, ventureToExploreCard } from "@/lib/venturesApi";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ExploreCard = ReturnType<typeof ventureToExploreCard>;

const ExploreLands = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lands, setLands] = useState<ExploreCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const stateParam = selectedFilter === "all" ? undefined : selectedFilter === "bangalore" ? "Karnataka" : selectedFilter === "mumbai" ? "Maharashtra" : selectedFilter === "hyderabad" ? "Telangana" : undefined;
    getVentures({ status: "live", state: stateParam, limit: 50 })
      .then((res) => {
        if (cancelled) return;
        setLands(res.items.map(ventureToExploreCard));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load lands");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedFilter]);

  const filteredLands = lands.filter(
    (land) =>
      land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Explore Lands</h1>
          <p className="text-muted-foreground mt-1">Discover verified land parcels and invest in fractions</p>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={() => navigate("/dashboard/user/resale-marketplace")}>
          Browse resale marketplace
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "bangalore", "mumbai", "hyderabad"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className="capitalize"
            >
              {filter === "all" ? "All Locations" : filter}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map((land, index) => (
            <motion.div
              key={land.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/dashboard/user/land/${land.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={land.image}
                  alt={land.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-green-600">{land.expectedROI} ROI</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground text-lg mb-1">{land.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {land.location}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Min Investment</p>
                    <p className="font-semibold text-foreground">{land.minInvestment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lock-in Period</p>
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {land.lockIn}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Available Tokens</span>
                    <span>{land.availableTokens}/{land.totalTokens}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${land.totalTokens > 0 ? ((land.totalTokens - land.availableTokens) / land.totalTokens) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <Button className="w-full group-hover:bg-primary/90">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && filteredLands.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No lands match your search.</p>
      )}
    </div>
  );
};

export default ExploreLands;
