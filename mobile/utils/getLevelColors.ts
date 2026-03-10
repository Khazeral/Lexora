export const getLevelColors = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    "#cd7f32": { bg: "#2a1a0a", text: "#cd7f32" },
    "#d1d5db": { bg: "#27272a", text: "#a1a1aa" },
    "#f59e0b": { bg: "#3d2e1a", text: "#fbbf24" },
    "#94a3b8": { bg: "#1e293b", text: "#94a3b8" },
    "#dc2626": { bg: "#3d1a1a", text: "#dc2626" },
  };
  return colorMap[color] || { bg: "#2a1a0a", text: "#cd7f32" };
};
