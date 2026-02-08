export const getStatusColors = (status?: string): [string, string, string] => {
  switch (status) {
    case "ruby":
      return ["#7f1d1d", "#dc2626", "#991b1b"];
    case "platinum":
      return ["#334155", "#94a3b8", "#475569"];
    case "gold":
      return ["#92400e", "#fbbf24", "#b45309"];
    case "silver":
      return ["#64748b", "#e2e8f0", "#94a3b8"];
    default:
      return ["#78350f", "#d97706", "#92400e"];
  }
};

export const getTextColor = (status?: string): string => {
  switch (status) {
    case "silver":
    case "platinum":
      return "#1e293b";
    default:
      return "#ffffff";
  }
};

export const getSubtextColor = (status?: string): string => {
  switch (status) {
    case "silver":
    case "platinum":
      return "#64748b";
    default:
      return "rgba(255, 255, 255, 0.7)";
  }
};
