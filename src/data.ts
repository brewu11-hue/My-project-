import { EducationalSection } from "./types";

export const EDUCATIONAL_SECTIONS: EducationalSection[] = [
  {
    id: "credit-scores-sa",
    title: "Understanding SA Credit Scores",
    subtitle: "Your financial passport to affordable credit",
    category: "credit",
    summary: "In South Africa, credit bureaus like TransUnion, Experian, Compuscan, and XDS track your repayment history. Your credit score is a number between 300 and 850 that reflects how risky it is for banks to lend to you.",
    keyPoints: [
      "Scores above 650 are considered good; above 720 is excellent.",
      "A poor score means you will pay much higher interest rates, or get rejected completely.",
      "By law, you are entitled to one FREE credit report from every bureau once a year.",
      "Paying even R50 short on accounts like store cards can flag your profile negatively."
    ],
    saReality: "Many South Africans fall prey to 'credit repair' scams. No one can legally wipe clean a accurate negative history for a fee; only time, consistent full payments, and proper dispute filing can fix your score."
  },
  {
    id: "debt-management-sa",
    title: "Navigating Debt & Store Cards",
    subtitle: "Distinguishing good debt from high-interest traps",
    category: "debt",
    summary: "Debt is a major issue in South Africa, where store cards (TFG, Truworths, Edgars) and personal loans are often pushed aggressively. Some microloans (mashonisas) charge unregulated, illegal compound rates.",
    keyPoints: [
      "Good Debt: Asset-building loans like home bonds or education loans with reasonable rates.",
      "Bad Debt: High-interest store accounts, clothing accounts, and payday loans used for consumable goods.",
      "The National Credit Act (NCA) protects you against reckless lending and sets maximum interest rates.",
      "Debt Review is a formal legal process under the NCA to consolidate payments if you are over-indebted."
    ],
    saReality: "Store card interest can easily exceed 20% to 24% per year. Buying clothing on a 6-month or 12-month interest account often means you pay nearly double the price of the clothes in the end."
  },
  {
    id: "budgeting-sa",
    title: "Budgeting for SA Realities",
    subtitle: "Managing Eskom, transport, and family support",
    category: "budgeting",
    summary: "Standard global budgeting rules (like the 50/30/20 rule) are often unrealistic for South Africans who face high transport taxi fares, prepaid electricity inflation, and family support obligations ('black tax').",
    keyPoints: [
      "Needs (e.g., Rent, Taxi/Petrol, Groceries, Prepaid Utilities) must be funded first.",
      "Family Support: Budget a fixed amount for extended family support to avoid breaking your own savings.",
      "Save small amounts: R100 saved consistently is better than R0.",
      "Track your bank debit orders: Ensure you cancel unneeded subscription traps and service fees."
    ],
    saReality: "Prepaid electricity and commuting costs in SA are highly variable. Budgeting separate 'emergency buffer funds' for winter electricity tariffs and unexpected taxi/train fare increases prevents credit card borrowing."
  },
  {
    id: "savings-stokvels",
    title: "SA Savings & Stokvels",
    subtitle: "Making your money work for you",
    category: "savings",
    summary: "South Africa offers brilliant savings vehicles. From traditional group savings schemes (Stokvels) to state-sponsored tax-free accounts, saving correctly can break cycles of intergenerational debt.",
    keyPoints: [
      "Tax-Free Savings Accounts (TFSA): Grow your money completely free of tax. You can save up to R36,000 per year, and R500,000 in a lifetime.",
      "RSA Retail Savings Bonds: A low-risk, government-backed investment that offers very competitive fixed interest rates.",
      "Stokvels: Traditional community saving pools. Ensure your Stokvel invests some funds in interest-bearing accounts instead of letting cash sit idle.",
      "Compound Interest: The longer you leave your money invested, the faster it grows as interest earns interest."
    ],
    saReality: "Stokvels are a massive R50-billion industry in SA. Traditional cash-and-distribute stokvels lose value to inflation. Modern stokvels are shifting towards purchasing property, shares, or high-yield investment structures."
  }
];

export const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape"
];
