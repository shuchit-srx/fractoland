import { motion } from "framer-motion";
import { Search, Coins, Vote } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "View Verified Lands",
    description: "Browse through government-verified land parcels with complete documentation and ownership history.",
    step: "01",
  },
  {
    icon: Coins,
    title: "Invest in Land Tokens",
    description: "Purchase fractional tokens of your chosen land using secure fiat payments (UPI, Cards).",
    step: "02",
  },
  {
    icon: Vote,
    title: "Vote, Exit & Earn",
    description: "Participate in governance, vote on land decisions, and earn profits when the land is sold.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-surface-subtle relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/30 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three Simple Steps to Own Land
          </h2>
          <p className="text-muted-foreground text-lg">
            Start your fractional land ownership journey in minutes
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px bg-border z-0" />
              )}
              
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border hover-lift relative z-10">
                {/* Step number */}
                <span className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                  <step.icon className="w-7 h-7 text-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
