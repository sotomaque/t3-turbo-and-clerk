import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import React from "react";
import { Button, View } from "react-native";

import * as AuthSession from "expo-auth-session";

type validOauthStrategies = "oauth_apple" | "oauth_discord" | "oauth_google";

type SocialLogin = {
  name: string;
  strategy: validOauthStrategies;
};

const socialLoginsEnabled: SocialLogin[] = [
  {
    name: "Apple",
    strategy: "oauth_apple",
  },
  {
    name: "Discord",
    strategy: "oauth_discord",
  },
  {
    name: "Google",
    strategy: "oauth_google",
  },
];

const SignInWithOAuth = () => {
  const { isLoaded, signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();
  if (!isLoaded) return null;

  const handleSignInWIthOauth = async (strategy: validOauthStrategies) => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: "/oauth-native-callback",
      });

      // chagne to oauth_discord for discord login
      await signIn.create({
        strategy: strategy,
        redirectUrl,
      });

      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;

      if (!externalVerificationRedirectURL)
        throw "Something went wrong during the OAuth flow. Try again.";

      const authResult = await AuthSession.startAsync({
        authUrl: externalVerificationRedirectURL.toString(),
        returnUrl: redirectUrl,
      });

      if (authResult.type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }

      // Get the rotatingTokenNonce from the redirect URL parameters
      const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;

      await signIn.reload({ rotatingTokenNonce });

      const { createdSessionId } = signIn;

      if (createdSessionId) {
        // If we have a createdSessionId, then auth was successful
        await setSession(createdSessionId);
      } else {
        // If we have no createdSessionId, then this is a first time sign-in, so
        // we should process this as a signUp instead
        // Throw if we're not in the right state for creating a new user
        if (
          !signUp ||
          signIn.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        console.log(
          "Didn't have an account transferring, following through with new account sign up",
        );

        // Create user
        await signUp.create({ transfer: true });
        await signUp.reload({
          rotatingTokenNonce: authResult.params.rotating_token_nonce,
        });
        await setSession(signUp.createdSessionId);
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  };

  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      {socialLoginsEnabled.map(({ name, strategy }) => (
        <Button
          title={`Sign in with ${name}`}
          onPress={() => handleSignInWIthOauth(strategy)}
        />
      ))}
    </View>
  );
};

export default SignInWithOAuth;
