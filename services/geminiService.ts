import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

// Define the response schema for strict JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      enum: ['SAFE', 'SUSPICIOUS', 'SCAM', 'UNCERTAIN'],
      description: "The final verdict of the scam analysis."
    },
    scam_score: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating likelihood of a scam (100 = definitely scam)."
    },
    red_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific indicators like urgency, poor grammar, money requests, or malicious scripts."
    },
    urls: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING },
          risk: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Safe'] },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      description: "Analysis of URLs found in the content."
    },
    summary: {
      type: Type.STRING,
      description: "A concise summary of the findings."
    },
    ai_image_probability: {
      type: Type.NUMBER,
      description: "If an image is analyzed, probability (0.0-1.0) it is AI generated."
    },
    image_analysis_details: {
      type: Type.OBJECT,
      properties: {
        skin_smoothness: { type: Type.STRING },
        background_warping: { type: Type.STRING },
        reflection_symmetry: { type: Type.STRING },
        edge_consistency: { type: Type.STRING }
      },
      description: "Heuristic details for image analysis."
    },
    extracted_text_preview: {
      type: Type.STRING,
      description: "The first 200 chars of text extracted from the file/image."
    }
  },
  required: ["verdict", "scam_score", "red_flags", "summary", "urls"]
};

export const analyzeContent = async (
  text: string,
  fileData?: { base64: string, mimeType: string }
): Promise<ScanResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const model = 'gemini-2.5-flash';

  const parts: any[] = [];
  
  // If file provided
  if (fileData) {
    if (fileData.mimeType === 'text/html') {
      // Decode base64 HTML content to string and send as text part for better analysis of scripts
      try {
        const decodedHtml = decodeURIComponent(escape(atob(fileData.base64)));
        parts.push({ 
          text: `[ANALYSIS TARGET: HTML FILE CONTENT START]\n${decodedHtml}\n[HTML FILE CONTENT END]` 
        });
      } catch (e) {
        console.warn("Failed to decode HTML base64", e);
        // Fallback to sending as inlineData if decoding fails (though strict text part is preferred for HTML)
         parts.push({
          inlineData: {
            data: fileData.base64,
            mimeType: fileData.mimeType
          }
        });
      }
    } else {
      // For Images, PDFs, etc.
      parts.push({
        inlineData: {
          data: fileData.base64,
          mimeType: fileData.mimeType
        }
      });
    }
  }

  // Add text prompt with enhanced instructions for HTML and Email formats
  let promptText = `Analyze the provided content for scam indicators. 
  
  1. Text Scam Analysis:
     - Extract all URLs, Phone Numbers, Emails.
     - Flag poor grammar, urgency keywords, money-transfer patterns.
     - Detect URL shorteners, punycode, or mismatched domains.
  `;

  if (fileData && fileData.mimeType === 'text/html') {
    promptText += `
    2. HTML/Web Source Analysis:
       - CRITICAL: Identify embedded malicious scripts, hidden iframes, or obfuscated JS.
       - Analyze href attributes for phishing redirects.
       - Detect deceptive visual overlays or fake login form structures.
    `;
  } else if (fileData && (fileData.mimeType === 'application/vnd.ms-outlook' || fileData.mimeType.includes('email'))) {
    promptText += `
    2. Email/Outlook File Analysis:
       - Analyze email headers (if visible) for spoofing.
       - Check for "From" address mismatches.
       - Detect phishing attachments or links to credential harvesting sites.
    `;
  } else if (fileData && fileData.mimeType.startsWith('image/')) {
    promptText += `
    2. Image Forensics (AI Likelihood):
       - Analyze skin smoothness, background warping, eye reflection symmetry, object edge consistency.
       - Estimate AI generation probability.
    `;
  } else if (fileData) {
     promptText += `
     2. Document Analysis:
        - Extract readable text from the document.
        - Analyze the content for fraudulent patterns.
     `;
  }

  if (text) {
    promptText += `\nAdditional Context/Text Input: ${text}`;
  }

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert cybersecurity analyst and fraud detection system. Be critical and detail-oriented. For HTML files, pay special attention to scripts and hidden redirects.",
        temperature: 0.2,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as ScanResult;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};