import { motion } from "framer-motion";
import { User, Building2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const loginTypes = [
  {
    icon: User,
    title: "Individual / Investor",
    description: "Browse lands, invest in tokenized parcels, track your portfolio, and participate in governance voting.",
    features: ["View verified lands", "Invest with fiat", "Track ROI", "Vote on decisions"],
    role: "investor",
    href: "http://localhost:8080/login?role=user&userType=individual"
  },
  {
    icon: Building2,
    title: "Property Owners",
    description: "List and manage your properties, track tokens, and handle exit requests.",
    features: ["List properties", "Manage tokens", "Track requests", "Secure payments"],
    role: "owner",
  },
  {
    icon: Users,
    title: "Realestate Consultants",
    description: "Refer investors to the platform, manage your network, and earn commissions on successful investments.",
    features: ["Generate referral links", "Track investor activity", "Earn commissions", "Withdraw earnings"],
    role: "agent",
  },
];

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background relative">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 block">
            Get Started
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Role
          </h2>
          <p className="text-muted-foreground text-lg">
            Select how you want to participate in the FractoLand ecosystem
          </p>
        </motion.div>

        {/* Login cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {loginTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border hover-lift h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <type.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {type.title}
                </h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {type.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-8">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant="card"
                  className="mt-auto"
                  onClick={() => {
                    if (type.href) {
                      window.location.href = type.href;
                    } else {
                      navigate(`/login?role=${type.role}`);
                    }
                  }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginSelection;
