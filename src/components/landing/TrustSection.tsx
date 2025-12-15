import { motion } from "framer-motion";
import { Shield, FileCheck, CreditCard, Lock } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Blockchain-Backed Ownership",
    description: "Every land token is secured on blockchain, providing immutable proof of ownership that cannot be tampered with.",
  },
  {
    icon: FileCheck,
    title: "Government Verification",
    description: "All land parcels undergo rigorous government verification and legal due diligence before listing.",
  },
  {
    icon: CreditCard,
    title: "Secure Fiat Transactions",
    description: "Invest using familiar payment methods — UPI, cards, and bank transfers — with bank-grade encryption.",
  },
  {
    icon: Lock,
    title: "Smart Contract Security",
    description: "Automated smart contracts ensure transparent governance, fair voting, and secure profit distribution.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-surface-subtle relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/30 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 block">
              Trust & Transparency
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built on Trust,
              <br />
              <span className="text-muted-foreground">Secured by Technology</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              FractoLand combines the security of blockchain technology with 
              traditional real estate due diligence, creating a transparent and 
              trustworthy platform for fractional land ownership.
            </p>
          </motion.div>

          {/* Right grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {trustPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover-lift"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <point.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
