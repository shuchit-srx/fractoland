import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle, HardHat, ShieldCheck, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar"; // Reusing Navbar, but you might want a specific one later
import Footer from "@/components/landing/Footer";

const DeveloperLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Custom Navbar for Developer Portal */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6 lg:px-12">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <HardHat className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">FractoLand <span className="text-black">Builder</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate("/developer/login")}>
                        Sign In
                    </Button>
                    <Button className="bg-black hover:bg-zinc-800 text-white" onClick={() => navigate("/developer/register")}>
                        Join as Builder
                    </Button>
                </div>
            </nav>

            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50/50 to-background">
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white font-medium text-sm mb-6 border border-zinc-200">
                                    <HardHat className="w-4 h-4" />
                                    For Real Estate Developers & Construction Firms
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Build the Future with <br />
                                    <span className="text-black">Tokenized Funding</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    Access instant liquidity, bid on verified land parcels, and manage your construction projects on the blockchain.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" className="h-12 px-8 text-base bg-black hover:bg-zinc-800 text-white" onClick={() => navigate("/developer/register")}>
                                        Start Bidding
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => navigate("/developer/login")}>
                                        Builder Login
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Abstract Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-10 w-64 h-64 bg-zinc-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-secondary/30">
                    <div className="container px-4 md:px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Building2, title: "Premium Land Bank", desc: "Access exclusive, government-verified land parcels ready for development." },
                                { icon: ShieldCheck, title: "Secure Contracts", desc: "Smart contracts ensure transparent bidding and guaranteed payments." },
                                { icon: Trophy, title: "Reputation System", desc: "Build your on-chain portfolio and qualify for larger projects." }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default DeveloperLanding;