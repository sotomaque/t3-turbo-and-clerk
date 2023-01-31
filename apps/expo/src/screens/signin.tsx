import React from "react";

import { View, SafeAreaView, Text } from "react-native";

import SignInWithOAuth from "../components/SignInWithOAuth";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="flex h-full w-full justify-between p-4">
        <View className="my-8 flex flex-row justify-center">
          <Text className="text-4xl font-bold text-white">Sign In</Text>
        </View>
        <SignInWithOAuth />
      </View>
    </SafeAreaView>
  );
};
