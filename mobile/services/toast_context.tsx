import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "@/app/components/Toast";
import { useTranslation } from "react-i18next";

type ToastContextType = {
  showAchievementToast: (count: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showAchievementToast = useCallback(
    (count: number) => {
      if (count <= 0) return;

      const msg =
        count === 1
          ? t("achievements.toast.singular")
          : t("achievements.toast.plural", { count });

      setMessage(msg);
      setVisible(true);
    },
    [t],
  );

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showAchievementToast }}>
      {children}
      <Toast visible={visible} message={message} onDismiss={handleDismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
