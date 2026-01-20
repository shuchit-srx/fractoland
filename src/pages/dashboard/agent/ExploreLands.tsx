import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Using the same static mock data for now, ideally this comes from a shared source or API
const lands = [
    {
        id: 1,
        name: "Green Valley Plot A12",
        location: "Bangalore, Karnataka",
        totalValue: "₹50,00,000",
        minInvestment: "₹25,000",
        availableTokens: 150,
        totalTokens: 200,
        lockIn: "18 months",
        expectedROI: "12-15%",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Sunrise Estate B7",
        location: "Hyderabad, Telangana",
        totalValue: "₹75,00,000",
        minInvestment: "₹50,000",
        availableTokens: 80,
        totalTokens: 150,
        lockIn: "24 months",
        expectedROI: "15-18%",
        image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Metro Park C3",
        location: "Chennai, Tamil Nadu",
        totalValue: "₹35,00,000",
        minInvestment: "₹15,000",
        availableTokens: 200,
        totalTokens: 250,
        lockIn: "12 months",
        expectedROI: "8-10%",
        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Lake View D9",
        location: "Pune, Maharashtra",
        totalValue: "₹1,00,00,000",
        minInvestment: "₹1,00,000",
        availableTokens: 45,
        totalTokens: 100,
        lockIn: "36 months",
        expectedROI: "18-22%",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Highway Corridor E5",
        location: "Mumbai, Maharashtra",
        totalValue: "₹2,50,00,000",
        minInvestment: "₹2,00,000",
        availableTokens: 30,
        totalTokens: 125,
        lockIn: "48 months",
        expectedROI: "20-25%",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Tech Park Zone F2",
        location: "Bangalore, Karnataka",
        totalValue: "₹85,00,000",
        minInvestment: "₹75,000",
        availableTokens: 60,
        totalTokens: 120,
        lockIn: "24 months",
        expectedROI: "14-17%",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop"
    },
];

const AgentExploreLands = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    const filteredLands = lands.filter(land =>
        land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        land.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Explore Lands</h1>
                    <p className="text-muted-foreground mt-1">Browse lands to refer to your network</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search lands to refer..."
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

            {/* Land Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLands.map((land, index) => (
                    <motion.div
                        key={land.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => navigate(`/dashboard/agent/land/${land.id}`)}
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
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-foreground text-lg">{land.name}</h3>
                            </div>

                            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                                <MapPin className="w-4 h-4" />
                                {land.location}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Min Investment</p>
                                    <p className="font-semibold text-foreground">{land.minInvestment}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Potential Commission</p>
                                    <p className="font-semibold text-green-600 flex items-center gap-1">
                                        Up to 2%
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Demand</span>
                                    <span>High</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Available Tokens</span>
                                    <span>{land.availableTokens}/{land.totalTokens}</span>
                                </div>
                            </div>

                            <Button className="w-full group-hover:bg-primary/90 gap-2">
                                <Link2 className="w-4 h-4" />
                                View & Refer
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AgentExploreLands;
