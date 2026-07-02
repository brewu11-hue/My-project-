import React, { useState } from "react";
import { Coins, PiggyBank, Award, HelpCircle, ArrowUpRight } from "lucide-react";

export default function SavingsStokvelCalculator() {
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [monthlySavings, setMonthlySavings] = useState<number>(500);
  const [years, setYears] = useState<number>(5);
  const [savingVehicle, setSavingVehicle] = useState<string>("tfsa"); // "regular", "tfsa", "retailbond", "stokvel"

  // Rates in South Africa
  const rates: { [key: string]: { name: string; rate: number; taxFree: boolean; desc: string } } = {
    regular: {
      name: "Standard SA Bank Savings Account",
      rate: 4.5,
      taxFree: false,
      desc: "Low interest, suitable for emergency short-term cash only. Interest above R23,800/year is taxable in SA."
    },
    tfsa: {
      name: "Tax-Free Savings Account (TFSA)",
      rate: 8.5,
      taxFree: true,
      desc: "Tax-free growth. Best for long-term investments. Limited to R36,000 deposit per tax year (R500k lifetime)."
    },
    retailbond: {
      name: "RSA Retail Savings Bond (Fixed)",
      rate: 10.25,
      taxFree: false,
      desc: "Guaranteed rate backed by the National Treasury. Excellent returns, locked for 3 or 5 years."
    },
    stokvel: {
      name: "Traditional Cash Stokvel",
      rate: 0,
      taxFree: true,
      desc: "Traditional physical cash pool or zero-interest bank account. No compound interest earned; loses value to inflation."
    }
  };

  const selectedVehicle = rates[savingVehicle];

  // Calculate compounding
  const calculateGrowth = (yearsPeriod: number) => {
    const r = selectedVehicle.rate / 100 / 12; // Monthly rate
    const totalMonths = yearsPeriod * 12;
    let balance = initialDeposit;
    let contributed = initialDeposit;

    for (let i = 0; i < totalMonths; i++) {
      balance += monthlySavings;
      contributed += monthlySavings;
      if (r > 0) {
        balance += balance * r;
      }
    }

    const interestEarned = Math.max(0, balance - contributed);
    return {
      contributed: Math.round(contributed),
      interest: Math.round(interestEarned),
      total: Math.round(balance)
    };
  };

  const results = calculateGrowth(years);

  // Compare 5, 10, 20 year values
  const fiveYearRes = calculateGrowth(5);
  const tenYearRes = calculateGrowth(10);
  const twentyYearRes = calculateGrowth(20);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="savings-stokvel-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <PiggyBank className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">South African Savings & Stokvel Growth Calculator</h3>
          <p className="text-xs text-gray-500">See how compounding interest turns small monthly savings into wealth using official SA structures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Initial Deposit (ZAR)</label>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 text-sm">R</span>
                </div>
                <input
                  type="number"
                  value={initialDeposit || ""}
                  onChange={(e) => setInitialDeposit(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="1000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Monthly Savings (ZAR)</label>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 text-sm">R</span>
                </div>
                <input
                  type="number"
                  value={monthlySavings || ""}
                  onChange={(e) => setMonthlySavings(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Savings Vehicle</label>
            <div className="space-y-2">
              {Object.keys(rates).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSavingVehicle(key)}
                  className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                    savingVehicle === key
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 ring-1 ring-emerald-500"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold block">{rates[key].name}</span>
                    <span className="text-[10px] text-gray-500 block max-w-sm">{rates[key].desc}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold block text-emerald-700">{rates[key].rate}% int.</span>
                    {rates[key].taxFree && (
                      <span className="text-[8px] font-bold text-white bg-emerald-600 px-1 py-0.5 rounded-sm uppercase tracking-wide">
                        Tax-Free
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Savings Term (Years)</label>
              <span className="text-xs text-emerald-700 font-bold font-mono">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Results display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/20 to-white text-center space-y-3">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">Est. Projected Total</span>
            <span className="block text-4xl font-black text-emerald-800 tracking-tight">R{results.total.toLocaleString("en-ZA")}</span>
            
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div className="text-left">
                <span className="text-[10px] text-gray-400 block uppercase">Cash Contributed</span>
                <span className="text-sm font-bold text-gray-800">R{results.contributed.toLocaleString("en-ZA")}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase">Compound Interest</span>
                <span className="text-sm font-extrabold text-emerald-600">
                  {results.interest > 0 ? `+R${results.interest.toLocaleString("en-ZA")}` : "R0 (Inflation loss)"}
                </span>
              </div>
            </div>
          </div>

          {/* SA stokvel advice if stokvel is selected */}
          {savingVehicle === "stokvel" && (
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 text-amber-900 text-xs leading-relaxed">
              💡 <span className="font-bold">Stokvel Best Practice:</span> Regular Cash Stokvels distribute cash yearly, which gets spent quickly. Suggest to your Stokvel committee to move your cash pools to a <span className="font-bold">high-yield bank account</span> or invest in <span className="font-bold">National Treasury Retail Bonds</span> to earn up to 10% compound interest as a group.
            </div>
          )}

          {/* Compound interest over time comparisons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700 block">The Magic of Compounding Interest over Time:</span>
            <div className="space-y-2">
              {[
                { label: "5 Years", val: fiveYearRes },
                { label: "10 Years", val: tenYearRes },
                { label: "20 Years", val: twentyYearRes }
              ].map((term) => (
                <div key={term.label} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{term.label}</span>
                    <span className="text-[10px] text-gray-500 block">
                      Contributed: R{term.val.contributed.toLocaleString("en-ZA")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-gray-900 block">R{term.val.total.toLocaleString("en-ZA")}</span>
                    {term.val.interest > 0 && (
                      <span className="text-[9px] font-semibold text-emerald-600 flex items-center justify-end gap-0.5">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        R{term.val.interest.toLocaleString("en-ZA")} interest
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
