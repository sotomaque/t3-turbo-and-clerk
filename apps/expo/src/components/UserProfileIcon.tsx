import React from "react";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// TODO: Type User
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserProfileIcon = ({ user }: { user: any }) => {
  if (user.profileImageUrl) {
    return (
      <Image
        className="h-12 w-12 rounded-full"
        source={{
          uri: `${user.profileImageUrl}`,
        }}
      />
    );
  }

  return <Ionicons name="person-circle-outline" size={48} color="black" />;
};
