import React, { useState } from "react";
import { 
  GraduationCap, 
  Sparkles, 
  Calculator, 
  PiggyBank, 
  BookOpen, 
  TrendingUp, 
  User, 
  PhoneCall, 
  HelpCircle,
  Menu,
  X,
  LogOut
} from "lucide-react";
import EducationalHub from "./components/EducationalHub";
import AIBudgetPlanner from "./components/AIBudgetPlanner";
import DebtInterestCalculator from "./components/DebtInterestCalculator";
import SavingsStokvelCalculator from "./components/SavingsStokvelCalculator";
import AuthScreen from "./components/AuthScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return (localStorage.getItem("khula_logged_in") || localStorage.getItem("londiwe_logged_in")) === "true";
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("khula_profile_name") || localStorage.getItem("londiwe_profile_name") || "Thabo";
  });
  const [activeTab, setActiveTab] = useState<string>("academy");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleAuthSuccess = (profile: { name: string; email: string; salary: number; financialGoal: string }) => {
    setUserName(profile.name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("khula_logged_in");
    localStorage.removeItem("londiwe_logged_in");
    setIsLoggedIn(false);
  };

  const tabs = [
    { id: "academy", label: "Financial Academy", icon: GraduationCap, desc: "Master financial literacy lessons & quizzes" },
    { id: "ai-budget", label: "AI Budgeting Plan", icon: Sparkles, desc: "Personalized ZAR budget generator" },
    { id: "debt-calc", label: "Debt & Interest Calculator", icon: Calculator, desc: "Calculate store card and compound rates" },
    { id: "savings-calc", label: "Savings & Stokvels", icon: PiggyBank, desc: "Compounding interest & savings vehicles" }
  ];

  if (!isLoggedIn) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-700 font-display">Khula</h1>
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Financial Literacy SA</p>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          type="button"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col p-6 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-700 font-display">Khula</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Financial Literacy SA</p>
        </div>

        {/* Tab triggers */}
        <nav className="space-y-1.5 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-medium text-xs cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                <div className="text-left">
                  <span className="block">{tab.label}</span>
                  <span className="text-[9px] text-gray-400 font-normal block md:hidden lg:block">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer block / Personalized Tip */}
        <div className="pt-6 border-t border-gray-100 mt-auto space-y-3">
          <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-400 block">Personalized Tip</span>
            <p className="text-[11px] font-medium leading-relaxed">
              Switching from traditional cash stokvels to a Tax-Free Savings Account (TFSA) can save you up to R1,200 annually in lost purchasing power.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors rounded-xl flex items-center gap-2 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout / Switch Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 overflow-y-auto">
        
        {/* Top Header Row */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-gray-900 font-display">
                Good Morning, <span className="font-semibold">{userName}</span>
              </h2>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value || "Friend")}
                placeholder="Your Name"
                className="w-20 md:w-24 px-2 py-1 text-xs border border-gray-200 rounded-md text-gray-600 bg-white/50 focus:bg-white focus:outline-none"
                title="Change username"
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Your South African financial health overview & tools</p>
          </div>
          
          <div className="text-left sm:text-right bg-white px-4 py-2 rounded-xl border border-gray-100 shrink-0">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">SA Prime Lending Rate</p>
            <p className="text-lg md:text-xl font-mono font-bold text-emerald-700">11.75%</p>
          </div>
        </header>

        {/* Dashboard Quick Stats snapshot grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Snapshot 1: Credit Score */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-3">Credit Health</span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight font-display">712</p>
                  <p className="text-emerald-600 text-[11px] font-semibold mt-0.5">▲ Good Bureau Standing</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent flex items-center justify-center">
                  <span className="text-[9px] font-bold text-emerald-600">GOOD</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 border-t border-gray-50 pt-2">
              Qualifies for standard lending rates. Limit clothing store defaults!
            </p>
          </div>

          {/* Snapshot 2: Typical ZAR Debt exposure info */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-3">Typical SA Store Debt Cost</span>
              <p className="text-3xl font-bold text-gray-900 tracking-tight font-display">R5,000</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-rose-500 h-full w-[43%]"></div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-gray-500 flex justify-between border-t border-gray-50 pt-2">
              <span>At 21% typical interest</span>
              <span className="text-rose-500 font-semibold">High interest risk</span>
            </p>
          </div>

          {/* Snapshot 3: AI Budgeting Guard info */}
          <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block mb-2">AI Budget Guard</span>
              <p className="text-sm font-medium leading-relaxed">
                Aim to reserve <span className="text-emerald-300 font-bold">15%</span> of your monthly net income for an emergency fund before store cards.
              </p>
            </div>
            <div className="flex gap-1.5 mt-3 pt-2 border-t border-emerald-800/60">
              <span className="bg-emerald-800 text-white text-[9px] px-2 py-0.5 rounded-sm">TFSA Target</span>
              <span className="bg-emerald-800 text-white text-[9px] px-2 py-0.5 rounded-sm">No Store Cards</span>
            </div>
          </div>
        </div>

        {/* Main Content Area showing currently selected tool */}
        <div className="flex-1 space-y-6">
          {activeTab === "academy" && (
            <div className="space-y-6">
              <EducationalHub />
              
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-xs text-gray-600 leading-relaxed flex gap-3 shadow-xs">
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-gray-800 mb-0.5">Know Your Rights under the National Credit Act (NCA)</span>
                  If you find yourself over-indebted with clothing limits or bank loans, you have a legal right to apply for Debt Review. Under this process, a registered debt counselor restructures your loans legally, stopping creditors from claiming your assets.
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai-budget" && <AIBudgetPlanner />}

          {activeTab === "debt-calc" && <DebtInterestCalculator />}

          {activeTab === "savings-calc" && <SavingsStokvelCalculator />}
        </div>

        {/* Footer / Bottom Navigation credentials */}
        <footer className="mt-12 pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400 font-medium gap-3">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <span>SA Financial Help Desk: 0800-FIN-HELP</span>
            <span>National Credit Regulator (NCR) compliant</span>
            <span>NCA Info Portal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Clean Minimalism Active</span>
          </div>
        </footer>

      </div>

      {/* Overlay for mobile navigation drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
