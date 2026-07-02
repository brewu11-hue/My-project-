import React, { useState } from "react";
import { Sparkles, Loader2, Award, ShieldAlert, CheckCircle2, RefreshCw, BarChart2 } from "lucide-react";
import { BudgetInputs, BudgetAdviceResponse } from "../types";
import { PROVINCES } from "../data";

export default function AIBudgetPlanner() {
  const [inputs, setInputs] = useState<BudgetInputs>(() => {
    const savedSalaryStr = localStorage.getItem("londiwe_profile_salary");
    const savedGoal = localStorage.getItem("londiwe_profile_goal");
    return {
      salary: savedSalaryStr ? Number(savedSalaryStr) : 12000,
      additionalIncome: 0,
      location: "Gauteng",
      dependents: 2,
      rentOrBond: 4000,
      transport: 1500,
      groceries: 2500,
      electricityWater: 1000,
      schoolFees: 800,
      funeralStokvel: 600,
      debtRepayments: 1200,
      otherExpenses: 800,
      financialGoal: savedGoal || "Build an emergency fund & reduce clothing accounts"
    };
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<BudgetAdviceResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "location" || name === "financialGoal" ? value : Number(value) || 0
    }));
  };

  const totalCurrentIncome = inputs.salary + inputs.additionalIncome;
  const totalCurrentExpenses = 
    inputs.rentOrBond + 
    inputs.transport + 
    inputs.groceries + 
    inputs.electricityWater + 
    inputs.schoolFees + 
    inputs.funeralStokvel + 
    inputs.debtRepayments + 
    inputs.otherExpenses;

  const currentSavings = totalCurrentIncome - totalCurrentExpenses;

  const handleGenerateAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gemini/budget-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });

      if (!res.ok) {
        throw new Error("Could not fetch advice from the server. Please verify your GEMINI_API_KEY in Settings > Secrets.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAdvice(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while communicating with the AI.");
      
      // Load a beautiful fallback mock response so the user doesn't get a broken experience if their key is not configured
      const fallback: BudgetAdviceResponse = {
        overallHealthScore: Math.round(Math.max(20, Math.min(95, 100 - (totalCurrentExpenses / (totalCurrentIncome || 1)) * 80))),
        savingsCapacityPercentage: 15,
        keyInsights: [
          "Your housing and debt costs consume over 43% of your income. In South Africa, keeping fixed costs below 50% is critical.",
          "R1,200 is allocated to store cards/debt. High-interest clothing debt (e.g. TFG/Edgars) often exceeds 24% interest and drains monthly cash.",
          "Your groceries and utilities represent a significant chunk. Eskom prepaid tariffs rise dramatically in winter, and food inflation remains a key SA challenge."
        ],
        suggestedBudget: [
          { category: "Housing (Rent/Bond)", suggestedZAR: Math.round(inputs.rentOrBond), percentage: Math.round((inputs.rentOrBond / totalCurrentIncome) * 100), explanation: "Ideally keep this below 35% of total salary." },
          { category: "Groceries & Household", suggestedZAR: Math.round(inputs.groceries * 0.9), percentage: Math.round(((inputs.groceries * 0.9) / totalCurrentIncome) * 100), explanation: "Shop at discount retailers like Boxer/Shoprite; opt for house brands." },
          { category: "Transport (Commute)", suggestedZAR: Math.round(inputs.transport), percentage: Math.round((inputs.transport / totalCurrentIncome) * 100), explanation: "Fixed cost of commuting. Try carpooling or look into monthly taxi ticket discounts." },
          { category: "Prepaid Utilities", suggestedZAR: Math.round(inputs.electricityWater * 0.95), percentage: Math.round(((inputs.electricityWater * 0.95) / totalCurrentIncome) * 100), explanation: "Use gas for cooking and turn off geysers during peak Eskom hours." },
          { category: "School & Funeral", suggestedZAR: Math.round(inputs.schoolFees + inputs.funeralStokvel), percentage: Math.round(((inputs.schoolFees + inputs.funeralStokvel) / totalCurrentIncome) * 100), explanation: "Essential cultural/educational safety nets. Compare funeral covers to ensure you are not over-paying." },
          { category: "Debt Paydown", suggestedZAR: Math.round(inputs.debtRepayments + (currentSavings > 0 ? currentSavings * 0.4 : 100)), percentage: Math.round(((inputs.debtRepayments + (currentSavings > 0 ? currentSavings * 0.4 : 100)) / totalCurrentIncome) * 100), explanation: "Pay extra into high-interest accounts to eliminate store debt permanently." },
          { category: "Savings / TFSA", suggestedZAR: Math.round(totalCurrentIncome * 0.15), percentage: 15, explanation: "Open a Tax-Free Savings Account. Invest at least R500 a month to earn tax-free compound growth." }
        ],
        debtPayoffStrategy: {
          recommendedMethod: "Snowball Strategy",
          estimatedMonths: 14,
          immediateAction: "Contact store card providers to negotiate a lower payment or freeze your interest while you settle."
        },
        customSavingsTips: [
          "Open a Tax-Free Savings Account (TFSA) with your bank or an investment platform. This is the single best wealth builder in SA.",
          "If your Stokvel distributes cash annually, recommend to your members to switch to a collective 32-day notice or RSA Retail Bonds instead of cash boxes.",
          "Check your bank account fees: Switch to basic digital accounts (like Capitec, Tymebank, or FNB Easy) to stop R100+ in monthly debit order fees."
        ]
      };
      setAdvice(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="ai-budget-container">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-1 rounded-full font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Empowered by AI
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI-Powered Budget & Life Planner</h2>
          <p className="text-xs text-indigo-200 max-w-xl">
            Input your salary, costs, and commitments. Our SA Financial Literacy Engine generates custom percentage targets, savings plans, and debt reduction frameworks customized to your local conditions.
          </p>
        </div>
        {/* Abstract decorative graphic */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Budget Form Inputs */}
        <form onSubmit={handleGenerateAdvice} className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-gray-900 text-base">Your Monthly Cashflow Inputs</h3>

          {/* Section: Income */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">Monthly Inflow</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Net Base Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs font-semibold text-gray-400">R</span>
                  <input
                    type="number"
                    name="salary"
                    value={inputs.salary || ""}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-200 pl-6 pr-2 py-1.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Additional Income</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs font-semibold text-gray-400">R</span>
                  <input
                    type="number"
                    name="additionalIncome"
                    value={inputs.additionalIncome || ""}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-200 pl-6 pr-2 py-1.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: SA Demographics */}
          <div className="space-y-3 border-t border-gray-50 pt-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">Demographics</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Province</label>
                <select
                  name="location"
                  value={inputs.location}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Dependents Supported</label>
                <input
                  type="number"
                  name="dependents"
                  value={inputs.dependents || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Outflows */}
          <div className="space-y-3 border-t border-gray-50 pt-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 block">Monthly Outflows (ZAR)</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Housing (Rent/Bond)</label>
                <input
                  type="number"
                  name="rentOrBond"
                  value={inputs.rentOrBond || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Transport (Taxi/Commute)</label>
                <input
                  type="number"
                  name="transport"
                  value={inputs.transport || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Groceries (Food)</label>
                <input
                  type="number"
                  name="groceries"
                  value={inputs.groceries || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Prepaid Lights & Water</label>
                <input
                  type="number"
                  name="electricityWater"
                  value={inputs.electricityWater || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">School Fees</label>
                <input
                  type="number"
                  name="schoolFees"
                  value={inputs.schoolFees || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Funeral Cover/Stokvel</label>
                <input
                  type="number"
                  name="funeralStokvel"
                  value={inputs.funeralStokvel || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Debt (Store cards/Loans)</label>
                <input
                  type="number"
                  name="debtRepayments"
                  value={inputs.debtRepayments || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1">Other Costs</label>
                <input
                  type="number"
                  name="otherExpenses"
                  value={inputs.otherExpenses || ""}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-gray-50 pt-3">
            <label className="block text-xs font-semibold text-gray-700">Financial Goal</label>
            <input
              type="text"
              name="financialGoal"
              value={inputs.financialGoal}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Settle clothing accounts, save for school fees"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing South African Budget Realities...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate My AI Budget Advice
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Results Output */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-xs text-rose-800 flex gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold block text-rose-900">Notice</span>
                {error}
                <br />
                <span className="opacity-80 block mt-1">We loaded a localized model-based fallback layout so you can test all features!</span>
              </div>
            </div>
          )}

          {!advice && !loading && (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-3">
              <BarChart2 className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="font-bold text-gray-700 text-sm">No Analysis Generated Yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Fill out your income & expense details on the left, and click "Generate My AI Budget Advice" to unlock personalized insights and recommendations.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4 shadow-xs">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Formulating Your Action Plan...</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                  Our South African advisory module is parsing your expense percentages, debt interest levels, and calculating optimized TFSA goals.
                </p>
              </div>
            </div>
          )}

          {advice && !loading && (
            <div className="space-y-6 animate-fade-in">
              {/* Score card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 text-center border-r border-gray-50 pr-0 md:pr-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Health Score</span>
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-8 border-indigo-50 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-indigo-900">{advice.overallHealthScore}</span>
                      <span className="text-[9px] text-gray-400">/100</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 block mt-3">
                    {advice.overallHealthScore >= 75 ? "Healthy Budget" : advice.overallHealthScore >= 50 ? "Moderate Stress" : "Critical Adjustment Needed"}
                  </span>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">Core Insights</span>
                  <ul className="space-y-2">
                    {advice.keyInsights.map((insight, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Side-by-side budget suggestions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h4 className="font-bold text-gray-900 text-sm">Optimized SA Budget Targets</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Target {advice.savingsCapacityPercentage}% Monthly Savings
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                        <th className="py-2">Category</th>
                        <th className="py-2 text-right">Suggested Target</th>
                        <th className="py-2 text-right">Allocation</th>
                        <th className="py-2 pl-4">Advisor Action Step</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {advice.suggestedBudget.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2.5 font-medium text-gray-900">{item.category}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-indigo-950">R{item.suggestedZAR.toLocaleString("en-ZA")}</td>
                          <td className="py-2.5 text-right font-semibold text-gray-500">{item.percentage}%</td>
                          <td className="py-2.5 pl-4 text-gray-500 text-[11px] leading-snug">{item.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Debt strategy & tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-widest">Debt Paydown Plan</span>
                    <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full">
                      {advice.debtPayoffStrategy.recommendedMethod}
                    </span>
                  </div>
                  <p className="text-xs text-rose-950">
                    With optimized budgeting, you could settle clothing limits & cash loans in approximately{" "}
                    <span className="font-bold text-rose-800">{advice.debtPayoffStrategy.estimatedMonths} months</span>.
                  </p>
                  <div className="pt-2 border-t border-rose-100 text-[11px] text-rose-800">
                    <span className="font-bold block text-rose-900">Your Immediate Action Step:</span>
                    {advice.debtPayoffStrategy.immediateAction}
                  </div>
                </div>

                <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Personalized Wealth Tips</span>
                  <ul className="space-y-2 text-[11px] text-emerald-900">
                    {advice.customSavingsTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reset trigger */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAdvice(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Analyze a different budget scenario
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
