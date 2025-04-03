import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { MoveoOne } from 'moveo-one-analytics-react-native';
import { HomeScreen } from "./HomeScreen";

const moveoInstance = MoveoOne.getInstance('<YOUR_SDK_TOKEN>');

export default function App() {
  useEffect(() => {
    moveoInstance.start('app_launch', {
      version: '1.0.0',
      environment: 'production'
    });
  }, []);

  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}
