// 📂 src/utils/langStore.js

export let uiLabels: Record<string, string> = {};
export const loadLanguageLabels = async (lang: any) => {
  try {
    const response = await fetch(`http://localhost:3000/translate/static-keys?lang=${lang}`);
    uiLabels = await response.json();
    console.log("Labels Loaded for:", lang);
  } catch (error) {
    console.error("Failed to load labels", error);
  }
};