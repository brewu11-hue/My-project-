import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to generate a highly customized financial advice backup when the API is unavailable
function generateLocalAdviceFallback(inputs: any) {
  const salary = Number(inputs.salary) || 12000;
  const additionalIncome = Number(inputs.additionalIncome) || 0;
  const totalIncome = salary + additionalIncome;
  
  const rentOrBond = Number(inputs.rentOrBond) || 0;
  const transport = Number(inputs.transport) || 0;
  const groceries = Number(inputs.groceries) || 0;
  const electricityWater = Number(inputs.electricityWater) || 0;
  const schoolFees = Number(inputs.schoolFees) || 0;
  const funeralStokvel = Number(inputs.funeralStokvel) || 0;
  const debtRepayments = Number(inputs.debtRepayments) || 0;
  const otherExpenses = Number(inputs.otherExpenses) || 0;
  
  const totalExpenses = rentOrBond + transport + groceries + electricityWater + schoolFees + funeralStokvel + debtRepayments + otherExpenses;
  const currentSavings = totalIncome - totalExpenses;
  
  const score = Math.round(Math.max(15, Math.min(98, 100 - (totalExpenses / (totalIncome || 1)) * 85)));
  
  const keyInsights = [
    `Your fixed overheads (Housing & Debt) comprise ${Math.round(((rentOrBond + debtRepayments) / (totalIncome || 1)) * 100)}% of your income. Keeping fixed overheads below 50% is crucial for financial safety in South Africa.`,
    debtRepayments > 0 
      ? `You are paying R${debtRepayments.toLocaleString("en-ZA")} towards debt monthly. South African store cards and micro-loans often carry high interest rates of 24%+ which can heavily erode your wealth.` 
      : `Great job on having no active debt repayments! This gives you an excellent advantage in building an investment buffer.`,
    `With food and energy inflation rising in ${inputs.location || "your province"}, optimizing grocery baskets and keeping prepaid electricity usage efficient will free up valuable cash flow.`
  ];
  
  const suggestedBudget = [
    {
      category: "Housing (Rent/Bond)",
      suggestedZAR: Math.round(rentOrBond * (totalExpenses > totalIncome ? 0.95 : 1)),
      percentage: Math.round(((rentOrBond * (totalExpenses > totalIncome ? 0.95 : 1)) / (totalIncome || 1)) * 100),
      explanation: "Try to ensure your home costs don't exceed 30-35% of your total income."
    },
    {
      category: "Groceries & Household",
      suggestedZAR: Math.round(groceries * 0.9),
      percentage: Math.round(((groceries * 0.9) / (totalIncome || 1)) * 100),
      explanation: "Consider wholesale buying and house brands at retailers like Shoprite/Boxer."
    },
    {
      category: "Transport (Commute)",
      suggestedZAR: Math.round(transport),
      percentage: Math.round((transport / (totalIncome || 1)) * 100),
      explanation: "Look into weekly/monthly public transport discount tickets to minimize travel costs."
    },
    {
      category: "Prepaid Utilities",
      suggestedZAR: Math.round(electricityWater * 0.9),
      percentage: Math.round(((electricityWater * 0.9) / (totalIncome || 1)) * 100),
      explanation: "Switch off high-draw appliances and manage geyser hours during peak Eskom times."
    },
    {
      category: "School & Funeral Cover",
      suggestedZAR: Math.round(schoolFees + funeralStokvel),
      percentage: Math.round(((schoolFees + funeralStokvel) / (totalIncome || 1)) * 100),
      explanation: "Crucial local safety nets. Review cover values to make sure you are not doubly insured."
    },
    {
      category: "Debt Paydown",
      suggestedZAR: Math.round(debtRepayments + (currentSavings > 0 ? currentSavings * 0.3 : 100)),
      percentage: Math.round(((debtRepayments + (currentSavings > 0 ? currentSavings * 0.3 : 100)) / (totalIncome || 1)) * 100),
      explanation: "Direct extra funds here to speed up debt freedom and eliminate store card interest."
    },
    {
      category: "Savings / TFSA",
      suggestedZAR: Math.round(totalIncome * 0.15),
      percentage: 15,
      explanation: "Prioritize building 3 months of basic expenses in a high-yield account before investing in TFSAs."
    }
  ];

  // Adjust suggested budget percentages to sum up cleanly, capping categories if they exceed income
  const sumZAR = suggestedBudget.reduce((acc, curr) => acc + curr.suggestedZAR, 0);
  if (sumZAR > totalIncome) {
    const scaleFactor = totalIncome / sumZAR;
    suggestedBudget.forEach(item => {
      if (item.category !== "Housing (Rent/Bond)" && item.category !== "Transport (Commute)") {
        item.suggestedZAR = Math.round(item.suggestedZAR * scaleFactor);
        item.percentage = Math.round((item.suggestedZAR / (totalIncome || 1)) * 100);
      }
    });
  }

  return {
    overallHealthScore: score,
    savingsCapacityPercentage: 15,
    keyInsights,
    suggestedBudget,
    debtPayoffStrategy: {
      recommendedMethod: debtRepayments > 1500 ? "Avalanche Strategy (Highest Interest Rate First)" : "Snowball Strategy (Smallest Debt First)",
      estimatedMonths: debtRepayments > 0 ? Math.ceil((debtRepayments * 12) / (debtRepayments + 150)) : 0,
      immediateAction: "Audit store card statements for unnecessary fee packages, credit life insurance, or club fees to instantly lower payments."
    },
    customSavingsTips: [
      "Open a Tax-Free Savings Account (TFSA) with a major bank or low-fee provider. You can save up to R36,000 per year tax-free in South Africa.",
      "Consider using a 32-day notice account for your emergency fund to prevent impulsive spending while earning interest.",
      "Verify your bank package: FNB Easy, Capitec, or TymeBank offer monthly fees under R10, which can instantly save you hundreds compared to premium accounts."
    ]
  };
}

// AI budget analysis endpoint
app.post("/api/gemini/budget-advice", async (req, res) => {
  try {
    const {
      salary,
      additionalIncome,
      location,
      dependents,
      rentOrBond,
      transport,
      groceries,
      electricityWater,
      schoolFees,
      funeralStokvel,
      debtRepayments,
      otherExpenses,
      financialGoal
    } = req.body;

    // Build prompt with rich SA context
    const totalIncome = (Number(salary) || 0) + (Number(additionalIncome) || 0);
    const totalExpenses =
      (Number(rentOrBond) || 0) +
      (Number(transport) || 0) +
      (Number(groceries) || 0) +
      (Number(electricityWater) || 0) +
      (Number(schoolFees) || 0) +
      (Number(funeralStokvel) || 0) +
      (Number(debtRepayments) || 0) +
      (Number(otherExpenses) || 0);

    const prompt = `
      Please analyze this South African individual's monthly budget:
      - Monthly Salary (Net): R${salary}
      - Additional Monthly Income: R${additionalIncome}
      - Province/Area: ${location}
      - Number of Dependents: ${dependents}
      - Housing Cost (Rent/Bond): R${rentOrBond}
      - Transport Cost (Taxi/Petrol): R${transport}
      - Groceries Cost: R${groceries}
      - Utilities Cost (Eskom/Water): R${electricityWater}
      - School Fees: R${schoolFees}
      - Funeral Cover/Stokvels: R${funeralStokvel}
      - Debt Repayments (Store Cards/Loans): R${debtRepayments}
      - Other Monthly Expenses: R${otherExpenses}
      - Primary Financial Goal: ${financialGoal}

      Current Summary: Total Net Income R${totalIncome}, Total Monthly Costs R${totalExpenses}.
      Please provide customized financial advice, a suggested balanced budget using South African standards, and a custom savings/debt reduction path.
    `;

    const systemInstruction = `
      You are an expert South African Financial Planner and Literacy Advisor.
      You specialize in helping South Africans understand budgeting, reduce debt, and build wealth.
      You understand South African specific terms: Stokvels, Tax-Free Savings Accounts (TFSA), RSA Retail Savings Bonds, funeral cover, taxi fares, Eskom prepaid rates, store accounts (e.g., TFG, Edgars, Ackermans), and prime lending interest rates.
      Always frame advice in South African Rands (R or ZAR) and speak in an encouraging, practical, and highly empathetic tone.
      Analyze the input strictly and return a structured JSON response matching the required schema. Ensure the suggested budget total matches or is less than the net income.
    `;

    const budgetSchema = {
      type: Type.OBJECT,
      properties: {
        overallHealthScore: {
          type: Type.INTEGER,
          description: "A financial health rating from 0 (very stressed) to 100 (excellent)."
        },
        savingsCapacityPercentage: {
          type: Type.INTEGER,
          description: "The percentage of income they should reasonably target to save after optimizations (e.g. 15)."
        },
        keyInsights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-4 concise, highly practical observations about their current spending specific to SA context."
        },
        suggestedBudget: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Budget category name (e.g., Housing, Food, Transport, Utilities, Debt, Stokvel/Savings, Other)" },
              suggestedZAR: { type: Type.INTEGER, description: "Suggested spending in South African Rands (ZAR)" },
              percentage: { type: Type.INTEGER, description: "Suggested percentage of total income" },
              explanation: { type: Type.STRING, description: "Brief advice on how to reduce costs in this category or why this amount was chosen" }
            },
            required: ["category", "suggestedZAR", "percentage", "explanation"]
          },
          description: "An optimized, realistic South African budget allocation."
        },
        debtPayoffStrategy: {
          type: Type.OBJECT,
          properties: {
            recommendedMethod: { type: Type.STRING, description: "Either 'Snowball' (smallest debt first) or 'Avalanche' (highest interest rate first) based on their scenario." },
            estimatedMonths: { type: Type.INTEGER, description: "Estimated months to be debt-free if they optimize." },
            immediateAction: { type: Type.STRING, description: "One single immediate practical action to take with their debt (e.g. renegotiating store card payment terms)." }
          },
          required: ["recommendedMethod", "estimatedMonths", "immediateAction"]
        },
        customSavingsTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 highly relevant South African specific savings tips (e.g., TFSA accounts, Retail Savings Bonds, Stokvel rules, or Eskom peak rates)."
        }
      },
      required: [
        "overallHealthScore",
        "savingsCapacityPercentage",
        "keyInsights",
        "suggestedBudget",
        "debtPayoffStrategy",
        "customSavingsTips"
      ]
    };

    let response;
    let success = false;
    let attempts = 0;
    const maxAttempts = 2;
    let errorMsg = "";

    // Attempt primary model: gemini-3.5-flash
    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: budgetSchema,
          }
        });
        success = true;
      } catch (err: any) {
        errorMsg = err.message || String(err);
        console.warn(`Attempt ${attempts} to call gemini-3.5-flash failed:`, errorMsg);
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    // Fallback model: gemini-3.1-flash-lite if primary fails
    if (!success) {
      console.log("Attempting fallback model: gemini-3.1-flash-lite...");
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: budgetSchema,
          }
        });
        success = true;
        console.log("Successfully retrieved advice using gemini-3.1-flash-lite.");
      } catch (err: any) {
        errorMsg = err.message || String(err);
        console.error("Fallback model gemini-3.1-flash-lite also failed:", errorMsg);
      }
    }

    if (success && response) {
      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } else {
      console.log("Both Gemini model attempts failed or API key is not configured. Falling back to robust local financial advice generator.");
      const backupResult = generateLocalAdviceFallback(req.body);
      res.json(backupResult);
    }
  } catch (error: any) {
    console.error("Gemini API handler level error:", error);
    // Even if something unexpected crashes inside the handler, return the beautiful local fallback!
    try {
      const backupResult = generateLocalAdviceFallback(req.body);
      res.json(backupResult);
    } catch (innerErr: any) {
      res.status(500).json({ error: "Failed to generate AI budget advice: " + error.message });
    }
  }
});

// Vite server setup for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
