export function formatComponentName(name: string): string {
  const formatted = name.replace(/([A-Z])/g, ' $1').trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
} 