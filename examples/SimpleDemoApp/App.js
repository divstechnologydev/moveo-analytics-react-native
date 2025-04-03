import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { HomeScreen } from "./HomeScreen";

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}
