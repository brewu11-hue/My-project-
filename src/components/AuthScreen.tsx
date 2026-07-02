import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, Wallet, Flag, HelpCircle } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (profile: {
    name: string;
    email: string;
    salary: number;
    financialGoal: string;
  }) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [salary, setSalary] = useState<number>(12000);
  const [financialGoal, setFinancialGoal] = useState<string>("Build an emergency fund & reduce clothing accounts");
  const [error, setError] = useState<string | null>(null);

  // Forgot Password States
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetNewPassword, setResetNewPassword] = useState<string>("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState<string>("");
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Typical South African quick goal templates
  const goalTemplates = [
    "Settle TFG & Edgars store accounts",
    "Save R20,000 for children school fees",
    "Build a 3-month Eskom/rent emergency fund",
    "Invest in RSA Retail Savings Bonds"
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (isRegistering && !name) {
      setError("Please fill in your name to personalize your profile.");
      return;
    }

    if (!isRegistering) {
      // Login check: enforce password match if it exists
      const savedEmail = localStorage.getItem("khula_profile_email") || localStorage.getItem("londiwe_profile_email");
      const savedPassword = localStorage.getItem("khula_profile_password");
      if (savedEmail && savedEmail.toLowerCase() === email.toLowerCase()) {
        if (savedPassword && savedPassword !== password) {
          setError("Incorrect password. Please try again or reset it using the 'Forgot Password?' link.");
          return;
        }
      }
    } else {
      // Register check: save password
      localStorage.setItem("khula_profile_password", password);
    }

    // Save profile details to localStorage for persistence
    const profile = {
      name: isRegistering ? name : (localStorage.getItem("khula_profile_name") || localStorage.getItem("londiwe_profile_name") || "Thabo"),
      email,
      salary: isRegistering ? salary : Number(localStorage.getItem("khula_profile_salary") || localStorage.getItem("londiwe_profile_salary") || 12000),
      financialGoal: isRegistering ? financialGoal : (localStorage.getItem("khula_profile_goal") || localStorage.getItem("londiwe_profile_goal") || "Settle store accounts")
    };

    localStorage.setItem("khula_logged_in", "true");
    localStorage.setItem("khula_profile_name", profile.name);
    localStorage.setItem("khula_profile_email", profile.email);
    localStorage.setItem("khula_profile_salary", profile.salary.toString());
    localStorage.setItem("khula_profile_goal", profile.financialGoal);

    // Keep writing to legacy key too so older profiles remain in sync if needed
    localStorage.setItem("londiwe_logged_in", "true");
    localStorage.setItem("londiwe_profile_name", profile.name);
    localStorage.setItem("londiwe_profile_email", profile.email);
    localStorage.setItem("londiwe_profile_salary", profile.salary.toString());
    localStorage.setItem("londiwe_profile_goal", profile.financialGoal);

    onAuthSuccess(profile);
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    if (!resetEmail || !resetNewPassword || !resetConfirmPassword) {
      setError("Please fill in all the reset fields.");
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    // Check if profile exists
    const savedEmail = localStorage.getItem("khula_profile_email") || localStorage.getItem("londiwe_profile_email");
    if (!savedEmail || savedEmail.toLowerCase() !== resetEmail.toLowerCase()) {
      setError("No registered profile found with that email address. Please verify your email or create a new profile.");
      return;
    }

    // Set new password
    localStorage.setItem("khula_profile_password", resetNewPassword);
    setResetSuccess("Your password has been reset successfully! You can now log in using your new password.");
    
    // Clear reset inputs
    setResetEmail("");
    setResetNewPassword("");
    setResetConfirmPassword("");
  };

  const handleLoginToggle = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setIsResetting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4" id="auth-screen-container">
      {/* Top Logo / Identity */}
      <div className="text-center mb-8 max-w-sm">
        <h1 className="text-3xl font-black tracking-tight text-emerald-700 font-display">Khula</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Financial Literacy & AI Advisor</p>
        <p className="text-xs text-gray-500 mt-2">
          Your personalized portal to understand credit scores, break store card debt traps, and target tax-free compounding.
        </p>
      </div>

      {/* Main Box */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs">
        {isResetting ? (
          /* Password Reset Flow */
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight font-display">
                Reset Password
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your registered email address and set a new password.
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl border border-rose-100 bg-rose-50 text-xs text-rose-800 font-medium">
                ⚠️ {error}
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 mb-4 rounded-xl border border-emerald-100 bg-emerald-50 text-xs text-emerald-800 font-medium">
                ✅ {resetSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              {/* Reset Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="you@domain.co.za"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Reset New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Update Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Back to login option */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              <button
                type="button"
                onClick={() => {
                  setIsResetting(false);
                  setError(null);
                  setResetSuccess(null);
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to Log In / Sign Up
              </button>
            </div>
          </div>
        ) : (
          /* Normal Sign Up or Log In */
          <div>
            {/* Modern Segmented Control Switcher */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-6 border border-gray-200/50">
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setError(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center ${
                  !isRegistering 
                    ? "bg-white text-emerald-800 shadow-xs" 
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setError(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center ${
                  isRegistering 
                    ? "bg-white text-emerald-800 shadow-xs" 
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                Create Profile
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight font-display">
                {isRegistering ? "Get Started" : "Welcome Back"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isRegistering 
                  ? "Tell us about your targets so we can customize your financial dashboards."
                  : "Enter your secure credentials to log back into Khula."}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl border border-rose-100 bg-rose-50 text-xs text-rose-800 font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* REGISTERING EXTRAS */}
              {isRegistering && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">First Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Thabo or Khula"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="you@domain.co.za"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Password</label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetting(true);
                        setError(null);
                        setResetSuccess(null);
                      }}
                      className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                    required
                  />
                </div>
                {!isRegistering && (
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
                    💡 <span className="font-semibold text-gray-500">Local Safe Mode:</span> Enter any demo credentials or use your registered details to access your dashboard.
                  </p>
                )}
              </div>

              {/* REGISTERING PROFILE DETAILS */}
              {isRegistering && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Customize Your Local Experience</span>
                  </div>

                  {/* Estimated monthly net salary */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estimated Net Monthly Salary (ZAR)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-gray-400">R</span>
                      <input
                        type="number"
                        value={salary || ""}
                        onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
                        className="block w-full rounded-xl border border-gray-200 pl-8 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30 font-mono font-bold"
                        placeholder="12000"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">We use this to build a healthy percentage-based budget target.</p>
                  </div>

                  {/* Financial Goal with templates */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Main Financial Goal</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Flag className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={financialGoal}
                        onChange={(e) => setFinancialGoal(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                        placeholder="e.g. Save for a school fees or settle debts"
                        required
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {goalTemplates.map((tpl) => (
                        <button
                          key={tpl}
                          type="button"
                          onClick={() => setFinancialGoal(tpl)}
                          className="px-2 py-0.5 text-[10px] bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded border border-gray-200/60 transition-colors"
                        >
                          {tpl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{isRegistering ? "Create Profile & Get Started" : "Log In to Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Toggle option */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              <span>{isRegistering ? "Already have a profile?" : "Need a custom profile first?"}</span>{" "}
              <button
                type="button"
                onClick={handleLoginToggle}
                className="text-emerald-700 font-bold hover:underline"
              >
                {isRegistering ? "Log In Here" : "Create Profile Here"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety info badge */}
      <div className="mt-8 flex items-center gap-2 text-[11px] text-gray-400 max-w-sm text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Khula stores your information locally on this device. We never sell your personal data or credit status.</span>
      </div>
    </div>
  );
}
