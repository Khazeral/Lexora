// hooks/useAchievements.ts
import { useState, useCallback } from "react";
import {
  checkAchievements,
  UnlockedAchievement,
} from "@/services/achievements.api";

type AchievementEventType =
  | "card_created"
  | "card_status_changed"
  | "training_completed"
  | "streak_reached"
  | "deck_created"
  | "total_correct";

export default function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    UnlockedAchievement[]
  >([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  const triggerAchievementCheck = useCallback(
    async (eventType: AchievementEventType, data?: Record<string, any>) => {
      try {
        const response = await checkAchievements(eventType, data);

        if (response.unlocked && response.unlocked.length > 0) {
          setUnlockedAchievements(response.unlocked);
          setShowAchievementModal(true);
        }

        return response.unlocked;
      } catch (error) {
        console.error("Error checking achievements:", error);
        return [];
      }
    },
    [],
  );

  const dismissAchievementModal = useCallback(() => {
    setShowAchievementModal(false);
    setUnlockedAchievements([]);
  }, []);

  return {
    unlockedAchievements,
    showAchievementModal,
    triggerAchievementCheck,
    dismissAchievementModal,
  };
}
