import React, { useState } from "react";
import { Calculator, HelpCircle, Flame, ShieldAlert, Sparkles } from "lucide-react";

export default function DebtInterestCalculator() {
  const [balance, setBalance] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(21); // 21% is very typical for SA store cards
  const [monthlyPayment, setMonthlyPayment] = useState<number>(350);
  const [extraPayment, setExtraPayment] = useState<number>(150);

  // Calculate payoff metrics with standard payment vs extra payment
  const calculatePayoff = (paymentVal: number) => {
    let currentBalance = balance;
    const r = interestRate / 100 / 12; // Monthly interest rate
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 360; // 30 year limit safety fallback

    if (paymentVal <= currentBalance * r) {
      return { 
        months: Infinity, 
        totalInterest: Infinity, 
        totalPaid: Infinity, 
        error: "Monthly payment is too low. It doesn't even cover the monthly interest! Balance will grow forever." 
      };
    }

    while (currentBalance > 0 && months < maxMonths) {
      const interestForMonth = currentBalance * r;
      totalInterest += interestForMonth;
      
      const principalPaid = Math.min(currentBalance, paymentVal - interestForMonth);
      currentBalance -= principalPaid;
      months++;
    }

    return {
      months,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(balance + totalInterest),
      error: null
    };
  };

  const standard = calculatePayoff(monthlyPayment);
  const optimized = calculatePayoff(monthlyPayment + extraPayment);

  // High interest rate warnings
  let warningMsg = "";
  let warningColor = "text-gray-500 bg-gray-50 border-gray-100";
  if (interestRate >= 35) {
    warningMsg = "⚠️ Extreme/Mashonisa Interest Rates: Rates above 30% are highly predatory or illegal under the NCA. You are likely paying more than double the capital value.";
    warningColor = "text-rose-700 bg-rose-50 border-rose-200";
  } else if (interestRate >= 20) {
    warningMsg = "🚨 Store Card Interest Rates: Typically 20% to 26% per annum. Store credit is extremely expensive; avoid buying clothes or electronics on multi-month payment accounts.";
    warningColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (interestRate >= 11) {
    warningMsg = "ℹ️ Bank Lending Rates: Currently pegged around the SA Prime Rate (approx 11.75% up to 18% based on your risk profile). Best for home bonds or credit record-backed vehicle loans.";
    warningColor = "text-indigo-700 bg-indigo-50 border-indigo-200";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="debt-calculator-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">South African Debt & Interest Payoff Calculator</h3>
          <p className="text-xs text-gray-500">Calculate how high SA interest rates destroy budget freedom, and how extra cash breaks the loop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Debt Balance (ZAR)</label>
            <div className="relative rounded-lg shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 text-sm">R</span>
              </div>
              <input
                type="number"
                value={balance || ""}
                onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
                className="block w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="5000"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Annual Interest Rate (%)</label>
              <span className="text-xs text-indigo-600 font-mono font-medium">{interestRate}% per year</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Prime (~11.75%)</span>
              <span>Store Account (21-25%)</span>
              <span>Mashonisa/Predatory (35%+)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Standard Payment (ZAR/mo)</label>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 text-sm">R</span>
                </div>
                <input
                  type="number"
                  value={monthlyPayment || ""}
                  onChange={(e) => setMonthlyPayment(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="350"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Extra Payment (ZAR/mo)</label>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 text-sm">R</span>
                </div>
                <input
                  type="number"
                  value={extraPayment || ""}
                  onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          {/* Quick templates */}
          <div className="pt-2">
            <span className="text-xs font-medium text-gray-500 block mb-1.5">Load Typical South African Scenarios:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setBalance(3500); setInterestRate(24); setMonthlyPayment(250); }}
                className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                TFG/Edgars Store Account (R3.5k @ 24%)
              </button>
              <button
                type="button"
                onClick={() => { setBalance(15000); setInterestRate(18); setMonthlyPayment(800); }}
                className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Capitec Personal Loan (R15k @ 18%)
              </button>
              <button
                type="button"
                onClick={() => { setBalance(2000); setInterestRate(45); setMonthlyPayment(300); }}
                className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 text-rose-600"
              >
                Mashonisa Payday Loan (R2k @ 45%)
              </button>
            </div>
          </div>
        </div>

        {/* Results Analysis */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main error or metrics cards */}
          {standard.error ? (
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 text-sm flex gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-rose-900">Debt Trap Warning!</span>
                {standard.error}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* Standard Payoff */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Paying Minimum</span>
                  <span className="block text-2xl font-black text-gray-900 mt-1">
                    {standard.months === Infinity ? "Never" : `${standard.months} months`}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/50 text-xs text-gray-500">
                  Total Interest: <span className="font-semibold text-gray-800">R{standard.totalInterest}</span>
                  <br />
                  Total Paid: <span className="font-semibold text-gray-800">R{standard.totalPaid}</span>
                </div>
              </div>

              {/* Extra Payoff */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Paying Extra ZAR</span>
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="block text-2xl font-black text-emerald-700 mt-1">
                    {optimized.months === Infinity ? "Never" : `${optimized.months} months`}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100 text-xs text-emerald-600">
                  Total Interest: <span className="font-semibold text-emerald-800">R{optimized.totalInterest}</span>
                  <br />
                  Total Saved: <span className="font-bold text-emerald-700">R{standard.totalInterest - optimized.totalInterest}</span>
                </div>
              </div>
            </div>
          )}

          {/* Savings visualization */}
          {!standard.error && !optimized.error && standard.months !== Infinity && optimized.months !== Infinity && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3">
              <Flame className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-950">
                <span className="font-semibold block text-indigo-900">Interest-Slayer Breakdown:</span>
                By paying just <span className="font-bold">R{extraPayment} extra</span> a month, you will be debt free <span className="font-bold text-indigo-700">{standard.months - optimized.months} months faster</span> and save <span className="font-bold text-indigo-700">R{standard.totalInterest - optimized.totalInterest}</span> in pure interest that would have gone to the banks.
              </div>
            </div>
          )}

          {/* Specific Interest Rate Warning message */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${warningColor}`}>
            {warningMsg}
          </div>
        </div>
      </div>
    </div>
  );
}
