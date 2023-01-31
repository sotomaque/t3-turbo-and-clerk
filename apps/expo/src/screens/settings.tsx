import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@clerk/clerk-expo";
//
interface Props {
  variant: "primary" | "outlined" | "secondary" | "text";
  onPress: () => void;
  className?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant,
  onPress,
  className,
  fullWidth = false,
  children,
}: Props) => {
  let bg = "";
  let color = "";
  let border = "";

  switch (variant) {
    case "primary":
      bg = "bg-blue-500";
      color = "text-white";
      break;
    case "outlined":
      border = "border border-blue-500";
      color = "text-blue-500";
      break;
    case "secondary":
      bg = "bg-gray-300";
      color = "text-gray-700";
      break;
    case "text":
      color = "text-blue-500";
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: fullWidth ? "100%" : undefined }}
      className={`${bg} ${color} ${border} rounded-full py-2 px-4 text-center font-medium ${className}`}
    >
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};
//

export const SettingsScreen = () => {
  // State
  const [selectedOption, setSelectedOption] = useState("General");
  const options = [
    "General",
    "Display & Brightness",
    "Wallpapers & Themes",
    "Sounds & Haptics",
  ];

  // Hook(s)
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex flex-auto flex-col bg-white">
      <ScrollView>
        <View className="h-16 justify-center bg-white px-5 py-4">
          <Text className="text-2xl font-bold">Settings</Text>
        </View>
        <View className="px-5">
          {options.map((option) => {
            const isSelected = option === selectedOption;

            return (
              <TouchableOpacity
                key={option}
                className="h-16 border-b border-gray-400 py-5"
                onPress={() => setSelectedOption(option)}
              >
                <Text className="text-lg font-medium">{option}</Text>
                {isSelected && (
                  <View className="absolute right-0">
                    <Ionicons
                      name={"checkmark-done"}
                      size={20}
                      color="#007AFF"
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View className="mb-5 flex flex-row justify-center">
        <Button
          variant="primary"
          onPress={() => {
            signOut();
          }}
        >
          <Text className="text-lg font-medium text-white">Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
