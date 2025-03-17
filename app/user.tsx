import { Redirect } from "expo-router";
import { UserScreen } from "../components/screens/UserScreen";
import { usePrivy } from "@privy-io/expo";
import LoginScreen from "@/components/screens/LoginScreen";

export default function User() {
  const { user } = usePrivy();
  if (!user) {
    return <LoginScreen />;
  } else {
    return <UserScreen />;
  }
}
