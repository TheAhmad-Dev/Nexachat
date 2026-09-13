import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authcontext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <StackLayout   />
    </AuthProvider>
  );
};
const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
      name="(auth)/welcome"
         options={{ presentation: "modal" }}
      />
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(main)/profileModel"
        options={{ presentation: "modal" }}
      />
      
   <Stack.Screen
        name="(main)/profileDashboard"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(main)/NewUserConversationModel"
        options={{ presentation: "modal" }}
      />
    </Stack>
    
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
