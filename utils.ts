import { ConversionItem } from "./types";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getHistory = (): ConversionItem[] => {
  const stored = localStorage.getItem('conversion_history');
  return stored ? JSON.parse(stored) : [];
};

export const saveToHistory = (item: ConversionItem) => {
  const history = getHistory();
  // Keep last 10
  const newHistory = [item, ...history].slice(0, 10);
  localStorage.setItem('conversion_history', JSON.stringify(newHistory));
};

export const clearHistory = () => {
  localStorage.removeItem('conversion_history');
};
