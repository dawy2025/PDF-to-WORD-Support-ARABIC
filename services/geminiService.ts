import { GoogleGenAI } from "@google/genai";
import { DocLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts file content (base64) into an HTML structure suitable for Word.
 * We use HTML because Word interprets it perfectly for tables, images, and RTL text,
 * avoiding the need for heavy client-side DOCX binary generation libraries.
 */
export const convertToWordHtml = async (
  base64Data: string,
  mimeType: string,
  targetLang: DocLanguage
): Promise<string> => {
  const isArabicTarget = targetLang === DocLanguage.ARABIC || targetLang === DocLanguage.AUTO;
  
  // Specific instructions to ensure robust HTML output that Word can open
  const systemPrompt = `
    You are a professional Document Conversion Engine.
    Your goal is to extract content from the provided file and convert it into Semantic HTML5.
    
    CRITICAL RULES:
    1. Output ONLY the HTML <body> content. Do NOT include <html> or <head> tags, and NO markdown fences.
    2. Preserve the layout as much as possible using HTML tables and CSS.
    3. Detect the language. If the text is primarily Arabic, set <div dir="rtl"> as the wrapper.
    4. For Tables: Use <table border="1" style="border-collapse: collapse; width: 100%;">.
    5. For Headings: Use <h1>, <h2>, etc.
    6. For Images: If the input is an image or contains images, describe them in text [Image: Description] OR if you can extract text, prioritize the text. 
       (Note: We cannot embed base64 images back into the completion easily due to token limits, so focus on TEXT and STRUCTURE reconstruction).
    7. Styling: Use inline styles for bold, colors, and alignment.
    8. ARABIC SPECIFIC: Ensure proper font-family 'Arial' or 'Traditional Arabic' is suggested in styles for Arabic text.
    
    Input MimeType: ${mimeType}
    Target Language Hint: ${targetLang}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: systemPrompt
          }
        ]
      }
    });

    const text = response.text || "";
    // Clean up if the model accidentally added markdown
    return text.replace(/```html/g, '').replace(/```/g, '').trim();

  } catch (error: any) {
    console.error("Gemini Conversion Error:", error);
    throw new Error(error.message || "Failed to convert document");
  }
};

export const wrapHtmlForWord = (htmlContent: string, isRTL: boolean): string => {
  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Converted Document</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.5; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
        td, th { border: 1px solid #000; padding: 5px; }
      </style>
    </head>
    <body style="tab-interval:36.0pt" ${isRTL ? 'dir="rtl"' : ''}>
      <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
      ${htmlContent}
    </body>
    </html>
  `;
};