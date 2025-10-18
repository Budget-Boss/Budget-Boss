import { GoogleGenAI, Type } from "@google/genai";
import type { FinancialData, BudgetPlan, BudgetMode } from '../types';
import { BudgetMode as BudgetModeEnum } from '../types';

// Fix: Adhere to the guideline of using process.env.API_KEY directly for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    potentialMonthlySavings: { 
      type: Type.NUMBER, 
      description: "The total potential savings per month, as a number." 
    },
    potentialAnnualSavings: { 
      type: Type.NUMBER, 
      description: "The total potential savings per year, calculated as monthly savings times 12." 
    },
    summary: { 
      type: Type.STRING, 
      description: "A brief, encouraging summary of the budget plan, 2-3 sentences long." 
    },
    budgetBreakdown: {
      type: Type.ARRAY,
      description: "A detailed breakdown of the budget by spending category.",
      items: {
        type: Type.OBJECT,
        properties: {
          category: { 
            type: Type.STRING, 
            description: "The name of the spending category (e.g., 'Housing', 'Groceries')." 
          },
          recommendedAmount: { 
            type: Type.NUMBER, 
            description: "The recommended monthly spending amount for this category." 
          },
          notes: { 
            type: Type.STRING, 
            description: "A brief tip or explanation for this category's recommended budget." 
          },
        },
        required: ["category", "recommendedAmount", "notes"],
      },
    },
    financialTips: {
      type: Type.ARRAY,
      description: "A list of 2-4 general and actionable financial tips to help the user save more.",
      items: { 
        type: Type.STRING 
      },
    },
    surplusSuggestions: {
      type: Type.ARRAY,
      description: "Optional: If the user has a large surplus after budgeting, provide 2-3 creative ideas for it (e.g., investments, travel).",
      items: {
        type: Type.STRING
      },
    },
  },
  required: ["potentialMonthlySavings", "potentialAnnualSavings", "summary", "budgetBreakdown", "financialTips"],
};

const getModeSpecificInstructions = (mode: BudgetMode, data: FinancialData): string => {
  switch (mode) {
    case BudgetModeEnum.MINIMALIST:
      return "For this plan, adopt an extreme 'cheapscape' or 'frugal survival' approach. The `budgetBreakdown` should **only** include absolute survival needs (e.g., essential housing, basic groceries, non-negotiable utilities). **Do not include** categories like entertainment, dining out, subscriptions, or hobbies in the `budgetBreakdown` at all—not even with a value of 0. Instead, in the `financialTips` section, you **must** add a tip explaining this choice. For example: 'Entertainment and dining out, among other non-essentials, are intentionally omitted from this plan to maximize savings. This aggressive, short-term strategy redirects all possible funds towards your financial goals.' For the food category, recommend extremely low-cost staples, citing the 'unseasoned dry chicken and white rice' principle. The overall summary should justify these drastic cuts as a high-intensity strategy to rapidly reach a critical financial goal.";
    case BudgetModeEnum.STANDARD:
    default:
      if (data.savingsGoal && data.savingsGoal > 0) {
        return `The user has a specific savings goal of ${data.savingsGoal} per month. Your primary objective is to construct a budget where the 'potentialMonthlySavings' in your response is **exactly** ${data.savingsGoal}.
- The total available spending for the month is (Income - Savings Goal).
- Your 'budgetBreakdown' must allocate this total available spending across the user's expense categories.
- If the user's initial expenses are lower than the available spending, you MUST increase the recommended amounts for their flexible, non-essential expense categories (like 'Entertainment', 'Shopping', 'Dining Out') to use the surplus. This demonstrates to the user that they can spend more on their wants while still comfortably hitting their savings target.
- If the user's expenses are higher, you must realistically reduce flexible spending to fit within the budget.
- The summary should highlight that the plan not only meets their goal but also gives them a clear picture of their comfortable spending limits.
- **Crucially, the final 'potentialMonthlySavings' value in the JSON object you return must be exactly ${data.savingsGoal}.**`;
      }
      return "For this plan, create a balanced '50/30/20' style budget (50% needs, 30% wants, 20% savings) as a guiding principle, but adjust it based on the user's data. The goal is a sustainable budget that allows for comfortable living while still achieving significant savings. The user should not feel overly restricted.";
  }
};

export const generateBudgetPlan = async (
  data: FinancialData,
  mode: BudgetMode
): Promise<BudgetPlan> => {
  const modeInstructions = getModeSpecificInstructions(mode, data);
  
  const systemInstruction = `You are 'Budget Boss', an expert financial advisor AI. Your goal is to create clear, actionable, and personalized budget plans to help users achieve their financial goals, such as retirement. Your tone must be encouraging, positive, and informative. Always provide a summary of potential monthly and annual savings. Use the user's currency implicitly without specifying a symbol. All monetary values in your response must be numbers, precise to two decimal places.`;
  
  const prompt = `Please create a budget plan based on the following financial data:
- Monthly Income (after tax): ${data.income}
${data.savingsGoal ? `- Desired Monthly Savings Goal: ${data.savingsGoal}\n` : ''}- Current Monthly Expenses: ${data.expenses}

**Health and Safety Rule:** Your primary responsibility is the user's financial and personal well-being. If you identify expense categories related to harmful or high-risk activities (such as 'gambling', 'drugs', 'heroine', 'alcohol', 'vaping', 'cigarettes'), you **must** set the \`recommendedAmount\` for these categories to \`0\`. In the \`notes\` for that budget item, provide a supportive and non-judgmental explanation, for example: 'We've set this to $0 to prioritize your long-term health and financial security, which is the most valuable investment you can make.' This rule overrides all other budgeting modes and instructions.

**Inflexible Expenses Rule:** The following expense categories are considered fixed and non-negotiable based on their names: rent, debt, tuition, loan, mortgage, car payment, insurance, child support, alimony. When you find an expense in the user's list that matches these, its recommended amount in the 'budgetBreakdown' **must remain exactly the same** as the user's input. You are not allowed to suggest reductions for these items. All budget adjustments must come from other, flexible spending categories.

**Core Principle: Realistic Budgeting for High Earners:** This principle overrides all other budgeting instructions when income is significantly higher than expenses.
1.  **Ground in Reality:** Your top priority is a budget reflecting a realistic, single-person lifestyle. Do NOT inflate spending categories just because income is high. Essential costs like 'Food' or 'Groceries' must stay within a sensible range for one person (e.g., $800-$1500 for a generous budget). 'Wants' like 'Entertainment' can be generous, but should also remain realistic.
2.  **Leave Surplus Unallocated:** Do NOT attempt to budget the entire income. After setting a realistic spending plan and meeting the user's savings goal (or setting a reasonable one if none is provided), leave the remaining massive surplus unallocated. The UI will automatically calculate this as "Money Left Over".
3.  **Use Surplus Suggestions:** Use the \`surplusSuggestions\` field to provide creative ideas for how the user can invest or use their large unallocated surplus. This helps them see the potential of their earnings.

**Critical Scenario Handling:** If the user's total 'Current Monthly Expenses' exceed their 'Monthly Income', your primary goal is to create a viable budget by recommending significant, realistic reductions to their spending. Your plan must bring their total expenses below their income to allow for savings. Be direct but encouraging about the need for these changes.

**Important Rule:** The 'budgetBreakdown' in your response must be based *only* on the expense categories provided by the user in 'Current Monthly Expenses'. You can recommend reducing the amount for an existing category or removing a category entirely by omitting it from the breakdown. **Do not introduce any new expense categories under any circumstances.** Your task is to optimize the user's *existing* expense list.

Apply the following budgeting approach: ${modeInstructions}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.5,
      },
    });

    // The response text is a string, but it's formatted as JSON due to responseSchema.
    const jsonText = response.text.trim();
    const parsedPlan: BudgetPlan = JSON.parse(jsonText);
    
    // Data validation and sanitization
    if (!parsedPlan.budgetBreakdown) {
        parsedPlan.budgetBreakdown = [];
    }
    if (!parsedPlan.financialTips) {
        parsedPlan.financialTips = [];
    }
    
    parsedPlan.potentialMonthlySavings = Number(parsedPlan.potentialMonthlySavings) || 0;
    parsedPlan.potentialAnnualSavings = Number(parsedPlan.potentialAnnualSavings) || 0;
    
    parsedPlan.budgetBreakdown = parsedPlan.budgetBreakdown.map(item => ({
        ...item,
        recommendedAmount: Number(item.recommendedAmount) || 0,
    }));

    return parsedPlan;
  } catch (error) {
    console.error("Error generating budget plan:", error);
    let errorMessage = "An unexpected error occurred while generating the plan.";
    if (error instanceof Error) {
        errorMessage = `API Error: ${error.message}`;
    }
    // It's better to throw the error so the UI can catch it and display a message.
    throw new Error(errorMessage);
  }
};