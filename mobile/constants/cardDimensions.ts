import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const CARD_WIDTH = SCREEN_WIDTH - 48;
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;
export const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
