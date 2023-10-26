import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import FormScreen from './FormScreen';

export default function App() {

  const [started, setStarted] = useState(false);

  let screen = <WelcomeScreen onStarted={setStarted}/>

  if (started) {
    screen = <FormScreen onStarted={setStarted}/>
  }

  function startForm() {
    setStarted(true)
  }

  return (
    <View style={styles.appContainer}>
      {screen}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
});