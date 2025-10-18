
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
  },
  required: ["potentialMonthlySavings", "potentialAnnualSavings", "summary", "budgetBreakdown", "financialTips"],
};

const getModeSpecificInstructions = (mode: BudgetMode): string => {
  switch (mode) {
    case BudgetModeEnum.MINIMALIST:
      return "For this plan, adopt a 'minimalist' approach. Be very aggressive in suggesting cuts to non-essential spending to maximize savings potential. Provide a list of specific areas to cut back on and justify why these cuts are impactful for long-term savings goals like retirement. Focus on needs over wants.";
    case BudgetModeEnum.STANDARD:
    default:
      return "For this plan, create a balanced '50/30/20' style budget (50% needs, 30% wants, 20% savings) as a guiding principle, but adjust it based on the user's data. The goal is a sustainable budget that allows for comfortable living while still achieving significant savings. The user should not feel overly restricted.";
  }
};

export const generateBudgetPlan = async (
  data: FinancialData,
  mode: BudgetMode
): Promise<BudgetPlan> => {
  const modeInstructions = getModeSpecificInstructions(mode);
  
  const systemInstruction = `You are 'Budget Boss', an expert financial advisor AI. Your goal is to create clear, actionable, and personalized budget plans to help users achieve their financial goals, such as retirement. Your tone must be encouraging, positive, and informative. Always provide a summary of potential monthly and annual savings. Use the user's currency implicitly without specifying a symbol. All monetary values in your response must be numbers, precise to two decimal places.`;
  
  const prompt = `
    Please analyze the following financial information and generate a personalized budget plan.
    
    Budgeting Mode: ${mode}
    Monthly Income: ${data.income}
    Current Monthly Expenses (user-provided list): "${data.expenses}"
    
    Instructions:
    1. Analyze the income and the list of expenses provided. Infer categories and amounts from the user's expense list.
    2. Crucially, only create budget breakdown categories for items explicitly mentioned by the user. Do not invent or add categories that are not in the user's list. For example, if the user only lists 'food 234', your breakdown should only contain a 'food' category. Do not add 'rent' or 'groceries' if they were not mentioned.
    3. Based on the selected '${mode}' mode, create a new budget allocation for the provided expense categories.
    4. ${modeInstructions}
    5. Calculate the total potential monthly and annual savings based on your recommended budget.
    6. Provide a summary and some actionable tips.
    7. Your final output must be a JSON object that strictly adheres to the provided schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as BudgetPlan;

  } catch (error) {
    console.error("Error generating budget plan from Gemini API:", error);
    throw new Error("The AI model could not generate a plan. Please check your inputs or try again later.");
  }
};
