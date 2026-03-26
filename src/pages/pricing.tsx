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

type TierData = {
  newbie: string;
  pro: string;
  ultimate: string;
  sigma: string;
};

type FeatureItem = {
  name: string;
  sub?: string;
  monthly: TierData;
  quarterly: TierData;
  semiAnnual: TierData;
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
        monthly: { newbie: "10", pro: "25", ultimate: "60", sigma: "150" },
        quarterly: { newbie: "36", pro: "92", ultimate: "215", sigma: "538" },
        semiAnnual: { newbie: "72", pro: "182", ultimate: "453", sigma: "1214" }
      },
      {
        name: "UGC (Single/Multiple)", sub: "Up to 10 styles",
        monthly: { newbie: "6", pro: "15", ultimate: "37", sigma: "93" },
        quarterly: { newbie: "21", pro: "54", ultimate: "127", sigma: "318" },
        semiAnnual: { newbie: "48", pro: "121", ultimate: "302", sigma: "809" }
      },
    ]
  },
  {
    category: "Videos",
    items: [
      {
        name: "Short", sub: "6-10s",
        monthly: { newbie: "6", pro: "14", ultimate: "34", sigma: "86" },
        quarterly: { newbie: "19", pro: "50", ultimate: "116", sigma: "291" },
        semiAnnual: { newbie: "46", pro: "115", ultimate: "288", sigma: "772" }
      },
      {
        name: "Short", sub: "12-15s",
        monthly: { newbie: "5", pro: "12", ultimate: "30", sigma: "75" },
        quarterly: { newbie: "17", pro: "42", ultimate: "100", sigma: "250" },
        semiAnnual: { newbie: "39", pro: "98", ultimate: "244", sigma: "653" }
      },
      {
        name: "Mid-form", sub: "20-30s",
        monthly: { newbie: "4", pro: "10", ultimate: "24", sigma: "59" },
        quarterly: { newbie: "13", pro: "33", ultimate: "77", sigma: "194" },
        semiAnnual: { newbie: "30", pro: "77", ultimate: "192", sigma: "515" }
      },
      {
        name: "Long-form", sub: "45-60s",
        monthly: { newbie: "-", pro: "6", ultimate: "15", sigma: "37" },
        quarterly: { newbie: "-", pro: "23", ultimate: "53", sigma: "134" },
        semiAnnual: { newbie: "-", pro: "53", ultimate: "132", sigma: "354" }
      },
      {
        name: "Long-form", sub: "60-90s",
        monthly: { newbie: "-", pro: "-", ultimate: "13", sigma: "32" },
        quarterly: { newbie: "-", pro: "-", ultimate: "45", sigma: "113" },
        semiAnnual: { newbie: "-", pro: "-", ultimate: "105", sigma: "283" }
      },
    ]
  },
  {
    category: "UGC",
    items: [
      {
        name: "Single Scene",
        monthly: { newbie: "-", pro: "9", ultimate: "22", sigma: "56" },
        quarterly: { newbie: "-", pro: "33", ultimate: "77", sigma: "194" },
        semiAnnual: { newbie: "-", pro: "79", ultimate: "198", sigma: "531" }
      },
      {
        name: "Multi Scene",
        monthly: { newbie: "-", pro: "4", ultimate: "11", sigma: "28" },
        quarterly: { newbie: "-", pro: "16", ultimate: "38", sigma: "97" },
        semiAnnual: { newbie: "-", pro: "36", ultimate: "90", sigma: "242" }
      },
    ]
  },
  {
    category: "Ad Comm",
    items: [
      {
        name: "Single",
        monthly: { newbie: "Custom", pro: "Custom", ultimate: "Custom", sigma: "Custom" },
        quarterly: { newbie: "Custom", pro: "Custom", ultimate: "Custom", sigma: "Custom" },
        semiAnnual: { newbie: "Custom", pro: "Custom", ultimate: "Custom", sigma: "Custom" }
      },
      {
        name: "2 Variants",
        monthly: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" },
        quarterly: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" },
        semiAnnual: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" }
      },
      {
        name: "3 Variants",
        monthly: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" },
        quarterly: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" },
        semiAnnual: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" }
      },
      {
        name: "Perf. Ad Sets",
        monthly: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" },
        quarterly: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" },
        semiAnnual: { newbie: "-", pro: "-", ultimate: "Custom", sigma: "Custom" }
      },
    ]
  }
];

const renderValue = (val: string) => {
  if (val === "-") return <X className="w-5 h-5 text-zinc-800" />;
  if (val === "Custom") return <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 border border-purple-500/30 bg-purple-500/10 rounded-full px-2 py-1">Custom</span>;
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden pt-20">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-900/10 blur-[120px]" />
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
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
                className={`relative p-8 rounded-3xl border flex flex-col ${plan.popular ? 'border-purple-500/50 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'border-zinc-800 bg-zinc-900/30'} backdrop-blur-md`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
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
                <div className="mt-auto">
                  <button className={`w-full py-3 rounded-xl font-medium transition-all active:scale-95 ${plan.popular ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Detailed Comparison Table */}
        <section className="px-6 max-w-7xl mx-auto pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center md:text-left max-w-3xl"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">What can your credits buy?</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              The numbers below show the <strong className="text-zinc-200 font-semibold">maximum output</strong> if you spend all your credits on a single asset type.
              For example, with 750 credits, you can create 10 Normal Statics <strong className="text-zinc-200 font-semibold">OR</strong> 6 Short Videos.
              Mix and match assets to fit your campaign!
            </p>
          </motion.div>

          <div className="overflow-x-auto pb-8 scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-zinc-800 w-1/4 sticky left-0 bg-[#050505]/90 backdrop-blur-md z-20"></th>
                  {plans.map(plan => (
                    <th key={plan.name} className="p-4 border-b border-zinc-800 text-xl font-semibold text-zinc-100">
                      <div>{plan.name}</div>
                      <div className="text-sm font-normal text-zinc-500 mt-1">{getCredits(plan).toLocaleString()} Credits</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((category) => (
                  <React.Fragment key={category.category}>
                    {/* Category Header */}
                    <tr>
                      <td colSpan={5} className="p-4 pt-16 pb-4 text-xs font-bold uppercase tracking-widest text-purple-400 border-b border-zinc-800/50 sticky left-0 bg-[#050505]/90 backdrop-blur-md z-10">
                        {category.category}
                      </td>
                    </tr>
                    {/* Items */}
                    {category.items.map((item, itemIdx) => {
                      const currentData = billingCycle === 'Quarterly' ? item.quarterly : billingCycle === 'Semi-Annually' ? item.semiAnnual : item.monthly;

                      return (
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
                          <td className="p-4 border-b border-zinc-800/50">
                            {renderValue(currentData.newbie)}
                          </td>
                          <td className="p-4 border-b border-zinc-800/50">
                            {renderValue(currentData.pro)}
                          </td>
                          <td className="p-4 border-b border-zinc-800/50">
                            {renderValue(currentData.ultimate)}
                          </td>
                          <td className="p-4 border-b border-zinc-800/50">
                            {renderValue(currentData.sigma)}
                          </td>
                        </motion.tr>
                      );
                    })}
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
