import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export const HomeScreen = ({ moveoInstance }) => {
  const [inputText, setInputText] = useState("");
  const [modelId, setModelId] = useState("demo-model-123"); // Default model ID for demo
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);

  useEffect(() => {
    // Initialize session first
    moveoInstance.start("main_screen", {
      app_version: "1.0.13",
      platform: "mobile",
      features: "prediction_api",
      demo_type: "analytics_and_prediction",
    });

    // Update additional metadata for prediction features
    moveoInstance.updateAdditionalMetadata({
      user_role: "demo_user",
      device_category: "mobile",
      has_predictions: "true",
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

  const handlePrediction = async () => {
    if (!modelId.trim()) {
      Alert.alert("Error", "Please enter a model ID");
      return;
    }

    setIsPredictionLoading(true);
    setPredictionResult(null);

    // Track the prediction request
    moveoInstance.track("main_screen", {
      semanticGroup: "user_interactions",
      id: "predict_button",
      type: "button",
      action: "tap",
      value: "request_prediction",
      metadata: {
        source: "home_screen",
        model_id: modelId,
      },
    });

    try {
      const result = await moveoInstance.predict(modelId);
      setPredictionResult(result);
      
      if (result.success) {
        Alert.alert(
          "Prediction Success",
          `Confidence: ${(result.prediction_probability * 100).toFixed(1)}%\nBinary Result: ${result.prediction_binary ? 'YES' : 'NO'}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Prediction Error", result.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Unexpected Error", "An unexpected error occurred during prediction.", [
        { text: "OK" },
      ]);
      console.error("Prediction error:", error);
    } finally {
      setIsPredictionLoading(false);
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <Text style={styles.title}>Moveo One</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.paragraph}>
          This is an example React Native app made for demo purposes with Prediction API support.
        </Text>
        
        {/* Existing Track Demo Section */}
        <Text style={styles.sectionTitle}>Track Demo</Text>
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

        {/* Prediction Demo Section */}
        <View style={styles.predictionSection}>
          <Text style={styles.sectionTitle}>Prediction Demo</Text>
          
          <TextInput
            style={styles.input}
            onChangeText={setModelId}
            value={modelId}
            placeholder="Enter Model ID..."
            placeholderTextColor="#a0aec0"
          />
          
          <TouchableOpacity
            style={[styles.button, styles.predictionButton]}
            onPress={handlePrediction}
            disabled={isPredictionLoading}
          >
            {isPredictionLoading ? (
              <ActivityIndicator color="white" style={{ marginRight: 10 }} />
            ) : null}
            <Text style={styles.buttonText}>
              {isPredictionLoading ? 'Getting Prediction...' : 'Get Prediction'}
            </Text>
          </TouchableOpacity>

          {/* Prediction Result Display */}
          {predictionResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Prediction Result:</Text>
              <Text style={styles.resultText}>
                Success: {predictionResult.success.toString()}
              </Text>
              <Text style={styles.resultText}>
                Status: {predictionResult.status}
              </Text>
              {predictionResult.success && (
                <>
                  <Text style={styles.resultText}>
                    Probability: {(predictionResult.prediction_probability * 100).toFixed(1)}%
                  </Text>
                  <Text style={styles.resultText}>
                    Binary: {predictionResult.prediction_binary.toString()}
                  </Text>
                </>
              )}
              {!predictionResult.success && (
                <Text style={[styles.resultText, styles.errorText]}>
                  Message: {predictionResult.message}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a365d",
    marginTop: 60,
    marginBottom: 40,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  contentContainer: {
    backgroundColor: "white",
    width: "85%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 15,
    marginTop: 10,
  },
  buttonGroup: {
    gap: 16,
  },
  button: {
    backgroundColor: "#2b6cb0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#2b6cb0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: "#4299e1",
  },
  predictionButton: {
    backgroundColor: "#38a169",
    marginTop: 10,
    paddingVertical: 16,
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
    marginTop: 10,
    shadowColor: "#2b6cb0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  predictionSection: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
  },
  resultContainer: {
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 5,
    fontFamily: "monospace",
  },
  errorText: {
    color: "#e53e3e",
    fontWeight: "500",
  },
});
