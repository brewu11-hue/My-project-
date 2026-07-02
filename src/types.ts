export interface BudgetInputs {
  salary: number;
  additionalIncome: number;
  location: string;
  dependents: number;
  rentOrBond: number;
  transport: number;
  groceries: number;
  electricityWater: number;
  schoolFees: number;
  funeralStokvel: number;
  debtRepayments: number;
  otherExpenses: number;
  financialGoal: string;
}

export interface SuggestedCategory {
  category: string;
  suggestedZAR: number;
  percentage: number;
  explanation: string;
}

export interface DebtPayoffStrategy {
  recommendedMethod: string;
  estimatedMonths: number;
  immediateAction: string;
}

export interface BudgetAdviceResponse {
  overallHealthScore: number;
  savingsCapacityPercentage: number;
  keyInsights: string[];
  suggestedBudget: SuggestedCategory[];
  debtPayoffStrategy: DebtPayoffStrategy;
  customSavingsTips: string[];
}

export interface EducationalSection {
  id: string;
  title: string;
  subtitle: string;
  category: "credit" | "debt" | "budgeting" | "savings";
  summary: string;
  keyPoints: string[];
  saReality: string; // Specific South African context
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}
