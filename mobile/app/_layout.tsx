import "../global.css";
import { AuthProvider } from "@/services/auth_context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "@/app/i18n/config";
import { ToastProvider } from "@/services/toast_context";
import Scanlines from "@/app/components/Scanlines2";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <Scanlines />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
