import { ThemeProvider } from "@/components/theme-provider";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerTitleStyle: {
            color: AC.label as any,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "My Location",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
