import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { HomeScreen } from "./HomeScreen";
import { MoveoOne } from "moveo-one-analytics-react-native";

// Initialize Moveo once at app entry
const moveoInstance = MoveoOne.getInstance("<YOUR_API_TOKEN>");

export default function App() {
  useEffect(() => {
    // Core initialization that should run once
    moveoInstance.setLogging(true);
    moveoInstance.setFlushInterval(20000);
  }, []);

  return (
    <>
      <HomeScreen moveoInstance={moveoInstance} />
      <StatusBar style="auto" />
    </>
  );
}
