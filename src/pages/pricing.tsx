import { motion } from "motion/react";
import { X } from "lucide-react";
import React, { useState } from "react";

type Plan = {
  name: string;
  monthlyCredits: number;
  quarterlyCredits: number;
  semiAnnualCredits: number;
  monthlyPrice: number;
  quarterlyPrice: number;
  semiAnnualPrice: number;
  popular?: boolean;
};

const plans: Plan[] = [
  { name: "Newbie", monthlyCredits: 750, quarterlyCredits: 2375, semiAnnualCredits: 5100, monthlyPrice: 125000, quarterlyPrice: 335000, semiAnnualPrice: 720000 },
  { name: "Pro", monthlyCredits: 1875, quarterlyCredits: 6000, semiAnnualCredits: 12750, monthlyPrice: 245000, quarterlyPrice: 695000, semiAnnualPrice: 1440000, popular: true },
  { name: "Ultimate", monthlyCredits: 4500, quarterlyCredits: 14000, semiAnnualCredits: 31750, monthlyPrice: 370000, quarterlyPrice: 1015000, semiAnnualPrice: 1990000 },
  { name: "Sigma", monthlyCredits: 11250, quarterlyCredits: 35000, semiAnnualCredits: 85000, monthlyPrice: 892500, quarterlyPrice: 2450000, semiAnnualPrice: 4750000 },
];

type CreditCost = {
  monthly: string;
  quarterly: string;
  semiAnnual: string;
};

type FeatureItem = {
  name: string;
  sub?: string;
  costs: CreditCost;
};

type FeatureCategory = {
  category: string;
  items: FeatureItem[];
};

const features: FeatureCategory[] = [
  {
    category: "Statics",
    items: [
      {
        name: "Normal",
        costs: { monthly: "75", quarterly: "65", semiAnnual: "70" }
      },
      {
        name: "UGC (Single/Multiple)", sub: "Up to 10 styles",
        costs: { monthly: "120", quarterly: "110", semiAnnual: "105" }
      },
    ]
  },
  {
    category: "Videos",
    items: [
      {
        name: "Short", sub: "6-10s",
        costs: { monthly: "130", quarterly: "120", semiAnnual: "110" }
      },
      {
        name: "Short", sub: "12-15s",
        costs: { monthly: "150", quarterly: "140", semiAnnual: "130" }
      },
      {
        name: "Mid-form", sub: "20-30s",
        costs: { monthly: "190", quarterly: "180", semiAnnual: "165" }
      },
      {
        name: "Long-form", sub: "45-60s",
        costs: { monthly: "300", quarterly: "260", semiAnnual: "240" }
      },
      {
        name: "Long-form", sub: "60-90s",
        costs: { monthly: "350", quarterly: "310", semiAnnual: "300" }
      },
    ]
  },
  {
    category: "UGC",
    items: [
      {
        name: "Single Scene",
        costs: { monthly: "200", quarterly: "180", semiAnnual: "160" }
      },
      {
        name: "Multi Scene",
        costs: { monthly: "400", quarterly: "360", semiAnnual: "350" }
      },
    ]
  },
  {
    category: "Ad Comm",
    items: [
      {
        name: "Single",
        costs: { monthly: "Custom", quarterly: "Custom", semiAnnual: "Custom" }
      },
      {
        name: "2 Variants",
        costs: { monthly: "-", quarterly: "-", semiAnnual: "-" }
      },
      {
        name: "3 Variants",
        costs: { monthly: "-", quarterly: "-", semiAnnual: "-" }
      },
      {
        name: "Perf. Ad Sets",
        costs: { monthly: "-", quarterly: "-", semiAnnual: "-" }
      },
    ]
  }
];

const billingLabels = {
  monthly: "Monthly Credits",
  quarterly: "Quarterly Credits",
  semiAnnual: "½ Yearly Credits",
};

const renderValue = (val: string) => {
  if (val === "-") return <X className="w-5 h-5 text-zinc-800" />;
  if (val === "Custom") return <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FF66] border border-[#00FF66]/30 bg-[#00FF66]/10 rounded-full px-2 py-1">Custom</span>;
  return <span className="font-semibold text-zinc-100 text-lg">{val}</span>;
};

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Quarterly' | 'Semi-Annually'>('Monthly');

  const getCredits = (plan: Plan) => {
    if (billingCycle === 'Quarterly') return plan.quarterlyCredits;
    if (billingCycle === 'Semi-Annually') return plan.semiAnnualCredits;
    return plan.monthlyCredits;
  };

  const getPrice = (plan: Plan) => {
    if (billingCycle === 'Quarterly') return plan.quarterlyPrice;
    if (billingCycle === 'Semi-Annually') return plan.semiAnnualPrice;
    return plan.monthlyPrice;
  };

  const getCycleText = () => {
    if (billingCycle === 'Quarterly') return '/quarter';
    if (billingCycle === 'Semi-Annually') return '/half-year';
    return '/mo';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00FF66]/30 font-sans overflow-x-hidden pt-20">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00FF66]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-12 pb-12 px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm font-medium text-zinc-300 backdrop-blur-md"
          >
            Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Nawfs <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-emerald-400">
              Credit Plans.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Choose the perfect plan for your brand's content needs. From statics to high-converting UGC videos.
          </motion.p>

          {/* Toggle Switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="bg-zinc-900/80 p-1.5 rounded-full border border-zinc-800 flex items-center relative w-fit mx-auto"
          >
            {(['Monthly', 'Quarterly', 'Semi-Annually'] as const).map((tab) => {
              const isActive = tab === billingCycle;
              return (
                <button
                  key={tab}
                  onClick={() => setBillingCycle(tab)}
                  className={`relative z-10 px-6 md:px-8 py-2.5 rounded-full text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-zinc-700 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </motion.div>
        </section>

        {/* Pricing Cards Overview */}
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className={`relative p-8 rounded-3xl border flex flex-col ${plan.popular ? 'border-[#00FF66]/50 bg-[#00FF66]/5 shadow-[0_0_30px_rgba(0,255,102,0.15)]' : 'border-zinc-800 bg-zinc-900/30'} backdrop-blur-md`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#00FF66] to-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-black">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-medium text-zinc-300 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">
                    {getCredits(plan).toLocaleString()}
                  </span>
                  <span className="text-zinc-400 font-medium ml-1">Credits</span>
                  <span className="text-zinc-500">{getCycleText()}</span>
                </div>
                <div className="text-lg font-medium text-zinc-300 mb-8">
                  ₹{getPrice(plan).toLocaleString('en-IN')}
                </div>

              </motion.div>
            ))}
          </div>
        </section>

        {/* Credit Cost Per Unit Table */}
        <section className="px-6 max-w-5xl mx-auto pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center md:text-left max-w-3xl"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Credit Cost Per Asset</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              See how many credits each content type costs.
              For example, <strong className="text-zinc-200 font-semibold">1 Normal Static = 75 credits</strong> on the monthly plan — so with 750 credits you can create 10 statics.
              Mix and match assets to fit your campaign!
            </p>
          </motion.div>

          <div className="overflow-x-auto pb-8 scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-zinc-800 w-1/4 sticky left-0 bg-[#050505]/90 backdrop-blur-md z-20"></th>
                  <th className="p-4 border-b border-zinc-800 text-center">
                    <div className="text-lg font-semibold text-zinc-100">Monthly</div>
                    <div className="text-xs font-normal text-zinc-500 mt-1">Credits</div>
                  </th>
                  <th className="p-4 border-b border-zinc-800 text-center">
                    <div className="text-lg font-semibold text-zinc-100">Quarterly</div>
                    <div className="text-xs font-normal text-zinc-500 mt-1">Credits</div>
                  </th>
                  <th className="p-4 border-b border-zinc-800 text-center">
                    <div className="text-lg font-semibold text-zinc-100">½ Yearly</div>
                    <div className="text-xs font-normal text-zinc-500 mt-1">Credits</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((category) => (
                  <React.Fragment key={category.category}>
                    {/* Category Header */}
                    <tr>
                      <td colSpan={4} className="p-4 pt-16 pb-4 text-xs font-bold uppercase tracking-widest text-[#00FF66] border-b border-zinc-800/50 sticky left-0 bg-[#050505]/90 backdrop-blur-md z-10">
                        {category.category}
                      </td>
                    </tr>
                    {/* Items */}
                    {category.items.map((item, itemIdx) => (
                      <motion.tr
                        key={item.name + (item.sub || '')}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.3, delay: itemIdx * 0.05 }}
                        className="group hover:bg-zinc-900/40 transition-colors"
                      >
                        <td className="p-4 border-b border-zinc-800/50 sticky left-0 bg-[#050505]/90 group-hover:bg-zinc-900/90 backdrop-blur-md z-10 transition-colors">
                          <div className="font-medium text-zinc-200">{item.name}</div>
                          {item.sub && <div className="text-xs text-zinc-500 mt-0.5">{item.sub}</div>}
                        </td>
                        <td className="p-4 border-b border-zinc-800/50 text-center">
                          {renderValue(item.costs.monthly)}
                        </td>
                        <td className="p-4 border-b border-zinc-800/50 text-center">
                          {renderValue(item.costs.quarterly)}
                        </td>
                        <td className="p-4 border-b border-zinc-800/50 text-center">
                          {renderValue(item.costs.semiAnnual)}
                        </td>
                      </motion.tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="border-t border-zinc-900 py-12 text-center text-zinc-600 text-sm">
          <p>All prices are in INR (₹). Custom plans available upon request.</p>
        </footer>
      </div>
    </div>
  );
}
