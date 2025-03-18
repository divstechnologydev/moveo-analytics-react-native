import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export const HomeScreen = ({ moveoInstance }) => {
  useEffect(() => {
    // Screen-specific initialization
    moveoInstance.start("main_screen", {
      app_version: "1.0.0",
      platform: "mobile",
    });
  }, [moveoInstance]);

  const handlePress = (buttonName) => {
    moveoInstance.track("main_screen", {
      semanticGroup: "user_interactions",
      id: "main_button",
      type: "button",
      action: "click",
      value: "primary_action",
      metadata: {
        source: "home_screen",
        button: buttonName,
      },
    });
    console.log(`${buttonName} clicked!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Demo App</Text>
      <Text
        style={styles.paragraph}
        onPress={() => {
          moveoInstance.tick({
            semanticGroup: "content_interactions",
            id: "intro_paragraph",
            type: "text",
            action: "press",
            value: "demo_description",
            metadata: {
              screen: "main_screen",
              interaction_type: "text_selection",
            },
          });
        }}
      >
        This is an example React Native app made for demo purposes.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Button One"
          onPress={() => handlePress("Button One")}
          style={styles.button}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Button Two"
          onPress={() => handlePress("Button Two")}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: "#34495e",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    marginVertical: 8,
  },
  buttonSpacer: {
    height: 12,
  },
});
