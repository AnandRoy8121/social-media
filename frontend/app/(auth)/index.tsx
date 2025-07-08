import { useSocialAuth } from "@/hooks/useSocialAuth";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { handleSocialAuth, isLoading } = useSocialAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          {/* Demo Image */}
          <View className="items-center">
            <Image
              source={require("../../assets/images/auth2.png")}
              className="size-96"
              resizeMode="contain"
            />
          </View>

          <View className="flex-col gap-3">
            {/* Google SignIn button */}
            <TouchableOpacity
              className="flex-row items-center justify-center border border-gray-300 px-6 py-3 rounded-full bg-white"
              disabled={isLoading}
              onPress={()=>handleSocialAuth('oauth_google')}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={"small"} color="#4285F4" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/google.png")}
                    className="size-10 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Apple SignIn button */}
            <TouchableOpacity
              className="flex-row items-center justify-center border border-gray-300 px-6 py-3 rounded-full bg-white"
              disabled={isLoading}
              onPress={()=>handleSocialAuth('oauth_apple')}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={"small"} color="#4285F4" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/apple.png")}
                    className="size-7 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    Continue with Apple
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* term and condition */}
          <View>
            <Text className="text-center text-gray-500 mt-6 px-2 text-sm leading-4">
              By signing you agree to our{" "}
              <Text className="text-blue-500">Terms</Text>
              {", "}
              <Text className="text-blue-500">Privacy Policy</Text>
              {", and "}
              <Text className="text-blue-500">Cookie Use</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
