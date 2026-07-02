import React, { useState } from "react";
import { ShieldCheck, AlertCircle, TrendingUp, Info } from "lucide-react";

export default function CreditScoreSimulator() {
  const [payingOnTime, setPayingOnTime] = useState<boolean>(true);
  const [creditUtilization, setCreditUtilization] = useState<string>("medium"); // "low", "medium", "high"
  const [recentApplications, setRecentApplications] = useState<number>(0);
  const [hasDefault, setHasDefault] = useState<boolean>(false);
  const [debtReview, setDebtReview] = useState<boolean>(false);

  // Calculate simulated score starting from a baseline of 600
  let score = 600;

  if (payingOnTime) {
    score += 85;
  } else {
    score -= 130;
  }

  if (creditUtilization === "low") {
    score += 50;
  } else if (creditUtilization === "high") {
    score -= 80;
  } // medium does nothing

  score -= recentApplications * 15;

  if (hasDefault) {
    score -= 150;
  }

  if (debtReview) {
    score = 350; // Debt review indicators flag the user as unable to take credit, score sits low
  }

  // Bound score between 300 and 850
  score = Math.max(300, Math.min(850, score));

  // Determine classification and color
  let status = "Good";
  let colorClass = "text-amber-500 bg-amber-50";
  let barColor = "bg-amber-500";
  let explanation = "";

  if (score >= 750) {
    status = "Excellent";
    colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
    barColor = "bg-emerald-500";
    explanation = "You get the best interest rates (e.g. Prime or Prime-1%). Banks trust you fully.";
  } else if (score >= 650) {
    status = "Good";
    colorClass = "text-teal-600 bg-teal-50 border-teal-200";
    barColor = "bg-teal-500";
    explanation = "You qualify for standard home and vehicle loans easily at decent interest rates.";
  } else if (score >= 580) {
    status = "Fair";
    colorClass = "text-amber-600 bg-amber-50 border-amber-200";
    barColor = "bg-amber-500";
    explanation = "You might get approved, but banks will charge you high interest rates (Prime + 4% or more).";
  } else {
    status = "Poor / High Risk";
    colorClass = "text-rose-600 bg-rose-50 border-rose-200";
    barColor = "bg-rose-500";
    explanation = debtReview 
      ? "Under Debt Review. Protected from creditors, but legally barred from taking any new credit."
      : "High risk of rejection. If approved, you will face maximum legal interest rates or resort to predatory lenders.";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="credit-simulator-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">South African Credit Score Simulator</h3>
          <p className="text-xs text-gray-500">See how daily decisions impact your borrowing power and interest rates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Pay on time */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="payOnTime"
              checked={payingOnTime}
              disabled={debtReview}
              onChange={(e) => setPayingOnTime(e.target.checked)}
              className="mt-1 h-4.5 w-4.5 rounded-sm text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="payOnTime" className="font-medium text-sm text-gray-900 block cursor-pointer">
                I pay all store cards, water/lights, & WiFi bills in full every month
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                {payingOnTime 
                  ? "✓ Great! Payment history is the biggest part (35%) of your score." 
                  : "✗ Paying late or skipping payments severely damages your credit history."}
              </p>
            </div>
          </div>

          {/* Credit utilization */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-medium text-sm text-gray-900">How much of your credit limit do you use?</label>
              <span className="text-xs font-mono text-gray-500">Credit Utilization</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Under 30%", value: "low", desc: "Healthy limit" },
                { label: "30% - 70%", value: "medium", desc: "Moderate use" },
                { label: "Over 80% (Maxed)", value: "high", desc: "Warning sign" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={debtReview}
                  onClick={() => setCreditUtilization(opt.value)}
                  className={`p-2 text-xs rounded-lg border text-center transition-all ${
                    creditUtilization === opt.value
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-medium"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hard inquiries */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <label className="font-medium text-sm text-gray-900 block">Recent new credit applications</label>
                <p className="text-xs text-gray-500">Applying for store cards or loans in the last 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={debtReview || recentApplications === 0}
                  onClick={() => setRecentApplications(p => Math.max(0, p - 1))}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center text-lg disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-6 text-center font-semibold text-sm">{recentApplications}</span>
                <button
                  type="button"
                  disabled={debtReview || recentApplications >= 5}
                  onClick={() => setRecentApplications(p => Math.min(5, p + 1))}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center text-lg disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Default judgements */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="hasDefault"
              checked={hasDefault}
              disabled={debtReview}
              onChange={(e) => setHasDefault(e.target.checked)}
              className="mt-1 h-4.5 w-4.5 rounded-sm text-rose-600 focus:ring-rose-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="hasDefault" className="font-medium text-sm text-rose-900 block cursor-pointer">
                I have a legal judgment or defaulted store account (listed by credit providers)
              </label>
              <p className="text-xs text-rose-600/80 mt-0.5">
                Defaults stay on your profile for up to 5 years, making interest rates extremely high.
              </p>
            </div>
          </div>

          {/* Debt Review */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="debtReview"
              checked={debtReview}
              onChange={(e) => setDebtReview(e.target.checked)}
              className="mt-1 h-4.5 w-4.5 rounded-sm text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="debtReview" className="font-medium text-sm text-gray-900 block cursor-pointer">
                I am placed under formal NCA Debt Review (Consolidated Debt Plan)
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Flags your bureau report, stopping creditors from taking assets but halting all new credit.
              </p>
            </div>
          </div>
        </div>

        {/* Display Simulated Score */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-gray-100 rounded-2xl p-5 bg-gradient-to-b from-gray-50 to-white">
          <div className="space-y-4 text-center">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">Simulated Score</span>
            
            <div className="relative py-4 flex items-center justify-center">
              {/* Simple Circular/Arc Meter simulation */}
              <div className="w-40 h-40 rounded-full border-8 border-gray-100 flex flex-col items-center justify-center bg-white shadow-sm relative">
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{score}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">out of 850</span>
                {/* Visual indicator dot */}
                <div 
                  className={`absolute w-3 h-3 rounded-full ${barColor} -bottom-1`}
                  style={{ transform: `rotate(${(score - 300) / 550 * 180}deg)` }}
                />
              </div>
            </div>

            <div className={`py-1.5 px-3 rounded-full text-xs font-semibold inline-block border ${colorClass}`}>
              Rating: {status}
            </div>

            <p className="text-xs text-gray-600 px-2 leading-relaxed">
              {explanation}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-gray-600">
                <span className="font-semibold block text-gray-800">Improvement Strategy</span>
                Pay clothing store cards first. Small card defaults weigh heavily in South Africa.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-gray-600">
                <span className="font-semibold block text-gray-800">Free Legal Right</span>
                Check your real score at least once a year at TransUnion or ClearScore SA for free.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
