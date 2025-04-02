import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { HomeScreen } from "./HomeScreen";

export default function App() {
  return (
    <>
      <HomeScreen moveoInstance={moveoInstance} />
      <StatusBar style="auto" />
    </>
  );
}
