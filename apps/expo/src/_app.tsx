import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";
import Ionicons from "@expo/vector-icons/Ionicons";

import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import Constants from "expo-constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "./screens/home";
import { DemoScreen } from "./screens/demo";
import { SettingsScreen } from "./screens/settings";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen
                  name="home"
                  component={HomeScreen}
                  options={{
                    tabBarLabel: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                      <Ionicons
                        name={focused ? "home" : "home-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="demo"
                  component={DemoScreen}
                  options={{
                    tabBarLabel: "Demo",
                    tabBarIcon: ({ focused, color, size }) => (
                      <Ionicons
                        name={focused ? "alarm" : "alarm-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="settings"
                  component={SettingsScreen}
                  options={{
                    tabBarLabel: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                      <Ionicons
                        name={focused ? "ios-settings" : "ios-settings-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
            <StatusBar />
          </SafeAreaProvider>
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="signup"
              component={SignInSignUpScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
