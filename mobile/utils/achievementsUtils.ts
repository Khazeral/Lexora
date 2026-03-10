import i18n from "@/app/i18n/config";

export function getAchievementName(code: string, fallback?: string): string {
  const key = `achievements.${code}.name`;
  const translated = i18n.t(key);
  return translated === key ? fallback || code : translated;
}

export function getAchievementDescription(
  code: string,
  fallback?: string,
): string {
  const key = `achievements.${code}.description`;
  const translated = i18n.t(key);
  return translated === key ? fallback || "" : translated;
}
