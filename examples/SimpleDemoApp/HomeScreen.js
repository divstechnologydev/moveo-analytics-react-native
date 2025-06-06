import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

export const HomeScreen = ({ moveoInstance }) => {
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    // Initialize session first
    moveoInstance.start("main_screen", {
      app_version: "1.0.0",
      platform: "mobile",
    });

    const timeout = setTimeout(() => {
      moveoInstance.tick({
        semanticGroup: "content_interactions",
        id: "intro_paragraph",
        type: "text",
        action: "appear",
        value: "demo_description",
        metadata: {
          screen: "main_screen",
        },
      });
      moveoInstance.tick({
        semanticGroup: "content_interactions",
        id: "main_button",
        type: "appear",
        action: "view",
        value: "main_button",
        metadata: {
          screen: "main_screen",
        },
      });
    }, 500);

    return () => {
      clearTimeout(timeout);

      moveoInstance.tick({
        semanticGroup: "content_interactions",
        id: "intro_paragraph",
        type: "text",
        action: "disappear",
        value: "demo_description",
        metadata: {
          screen: "main_screen",
        },
      });
      moveoInstance.tick({
        semanticGroup: "content_interactions",
        id: "main_button",
        type: "button",
        action: "disappear",
        value: "main_button",
        metadata: {
          screen: "main_screen",
        },
      });
    };
  }, [moveoInstance]);

  const handlePress = (buttonName) => {
    moveoInstance.track("main_screen", {
      semanticGroup: "user_interactions",
      id: "main_button",
      type: "button",
      action: "tap",
      value: "primary_action",
      metadata: {
        source: "home_screen",
        button: buttonName,
      },
    });
    console.log(`${buttonName} clicked!`);
  };

  const handleInputEndEditing = () => {
    moveoInstance.track("main_screen", {
      semanticGroup: "user_interactions",
      id: "main_input",
      type: "input",
      action: "edit",
      value: "text_entered",
      metadata: {
        source: "home_screen",
        input_length: inputText.length,
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Moveo One</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.paragraph}>
          This is an example React Native app made for demo purposes.
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("Button One")}
          >
            <Text style={styles.buttonText}>Button One</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handlePress("Button Two")}
          >
            <Text style={styles.buttonText}>Button Two</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setInputText}
          value={inputText}
          onEndEditing={handleInputEndEditing}
          placeholder="Type something..."
          placeholderTextColor="#a0aec0"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a365d",
    marginBottom: 40,
    letterSpacing: 1.2,
  },
  contentContainer: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#2b6cb0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  paragraph: {
    fontSize: 16,
    color: "#4a5568",
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 16,
  },
  button: {
    backgroundColor: "#2b6cb0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2b6cb0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: "#4299e1",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#4a5568",
    marginTop: 20,
    shadowColor: "#2b6cb0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
