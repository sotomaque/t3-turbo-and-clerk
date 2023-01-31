import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useLinkTo } from "@react-navigation/native";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { UserProfileIcon } from "../components/UserProfileIcon";

export const HomeScreen = () => {
  const linkTo = useLinkTo();
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) {
    return (
      // TODO: create react native spinner
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="m-3 flex-auto">
      {/* Profile Icon */}
      <View className="mb-2 flex items-end">
        <UserProfileIcon user={user} />
      </View>

      {/* Name Row */}
      <View className="flex">
        <Text className="text-lg font-medium">{`Hi, ${user.firstName}!`}</Text>
      </View>

      {/* Greeting Row */}
      <Text className="mt-2 mb-5 text-4xl font-semibold">
        What service do you need?
      </Text>

      <View className="flex flex-row justify-start">
        <TouchableOpacity
          onPress={() => {
            linkTo("/home");
          }}
          className="flex rounded-2xl bg-teal-600 px-4 py-2"
        >
          <Text className="flex-grow-0 font-semibold text-white">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
