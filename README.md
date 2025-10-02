# Moveo Analytics React Native Library

<img src="https://www.moveo.one/assets/og_white.png" alt="Moveo Analytics Logo" width="200" />

**Current version: 1.0.13**

A powerful analytics library for React Native applications that provides comprehensive user interaction tracking and behavioral analysis through the Moveo One platform.

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start Guide](#quick-start-guide)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Library Initialization](#library-initialization)
   - [Setup](#setup)
   - [Metadata and Additional Metadata](#metadata-and-additional-metadata)
   - [Track Data](#track-data)
3. [Event Types and Actions](#event-types-and-actions)
4. [Comprehensive Example Usage](#comprehensive-example-usage)
5. [Prediction API](#prediction-api)
6. [Obtain API Key](#obtain-api-key)
7. [Dashboard Access](#dashboard-access)
8. [Support](#support)

## Introduction

Moveo Analytics React Native Library is designed to capture and analyze user interactions within your React Native application. It provides detailed insights into user behavior, interaction patterns, and application usage through a comprehensive tracking system.

The library supports:
- **Context-based tracking** for organizing user sessions
- **Semantic grouping** for logical element organization
- **Flexible metadata** for enhanced analytics
- **Data processing** with configurable flush intervals
- **Multiple event types and actions** for comprehensive interaction capture
- **Pre-built components** for automatic tracking

## Quick Start Guide

### Prerequisites

- React Native project
- Node.js and npm installed
- Moveo One API key (obtain from [Moveo One App](https://app.moveo.one/))

### Installation

Install the package using npm:

```bash
npm install moveo-one-analytics-react-native
```

### Library Initialization

Initialize the library in your main App component:

```jsx
import { MoveoOne } from "moveo-one-analytics-react-native";

// Initialize with your API token
const moveoInstance = MoveoOne.getInstance("YOUR_API_KEY");
```

### Setup

Configure additional parameters as needed:

```jsx
// Set flush interval (5-60 seconds)
moveoInstance.setFlushInterval(20000); // 20 seconds

// Enable logging for debugging
moveoInstance.setLogging(true);
```

### Metadata and Additional Metadata

The library supports two types of metadata management:

#### updateSessionMetadata()

Updates current session metadata. Session metadata should split sessions by information that influences content or creates visually different variations of the same application. Sessions split by these parameters will be analyzed separately by our UX analyzer.

**Session metadata examples:**
- `sessionMetadata.put("test", "a");`
- `sessionMetadata.put("locale", "eng");`
- `sessionMetadata.put("app_version", "2.1.0");`

#### updateAdditionalMetadata()

Updates additional metadata for the session. This is used as data enrichment and enables specific queries or analysis by the defined split.

**Additional metadata examples:**
- `additionalMetadata.put("user_country", "US");`
- `additionalMetadata.put("company", "example_company");`
- `additionalMetadata.put("user_role", "admin"); // or "user", "manager", "viewer"`
- `additionalMetadata.put("acquisition_channel", "organic"); // or "paid", "referral", "direct"`
- `additionalMetadata.put("device_category", "mobile"); // or "desktop", "tablet"`
- `additionalMetadata.put("subscription_plan", "pro"); // or "basic", "enterprise"`
- `additionalMetadata.put("has_purchased", "true"); // or "false"`

**Metadata Support in Track and Tick Events:**

```jsx
import { TYPE, ACTION } from 'moveo-one-analytics-react-native';

// Track with metadata
moveoInstance.track("checkout_screen", {
  semanticGroup: "user_interactions",
  id: "checkout_button",
  type: TYPE.BUTTON,
  action: ACTION.CLICK,
  value: "proceed_to_payment",
  metadata: {
    test: "a",
    locale: "eng"
  }
});

// Tick with metadata
moveoInstance.tick({
  semanticGroup: "content_interactions",
  id: "product_card",
  type: TYPE.CARD,
  action: ACTION.APPEAR,
  value: "product_view",
  metadata: {
    test: "a",
    locale: "eng"
  }
});
```

### Track Data

#### Understanding start() Calls and Context

**Single Session, Single Start**

You **do not need multiple start() calls for multiple contexts**. The `start()` method is called only **once at the beginning of a session** and must be called before any `track()` or `tick()` calls.

```jsx
// Start session with context
moveoInstance.start("main_app_flow", {
  test: "a",
  locale: "eng"
});
```

#### When to Use Each Tracking Method

**Use track() when:**
- You want to explicitly specify the event context
- You need to change context between events
- You want to use different context than one specified in start method

```jsx
import { TYPE, ACTION } from 'moveo-one-analytics-react-native';

moveoInstance.track("checkout_process", {
  semanticGroup: "user_interactions",
  id: "payment_button",
  type: TYPE.BUTTON,
  action: ACTION.CLICK,
  value: "pay_now",
  metadata: {}
});
```

**Use tick() when:**
- You're tracking events within the same context
- You want tracking without explicitly defining context
- You want to track events in same context specified in start method

```jsx
import { TYPE, ACTION } from 'moveo-one-analytics-react-native';

moveoInstance.tick({
  semanticGroup: "screen_0",
  id: "text_view_1",
  type: TYPE.TEXT,
  action: ACTION.VIEW,
  value: "welcome_message",
  metadata: {}
});
```

#### Context Definition

- **Context** represents large, independent parts of the application and serves to divide the app into functional units that can exist independently of each other
- Examples: `onboarding`, `main_app_flow`, `checkout_process`

#### Semantic Groups

- **Semantic groups** are logical units **within a context** that group related elements
- Depending on the application, this could be a group of elements or an entire screen (most common)
- Examples: `navigation`, `user_input`, `content_interaction`

## Event Types and Actions

### Available Event Types

| Type | Description |
|------|-------------|
| `button` | Interactive buttons |
| `text` | Text elements |
| `textEdit` | Text input fields |
| `image` | Single images |
| `images` | Multiple images |
| `image_scroll_horizontal` | Horizontal image scrolling |
| `image_scroll_vertical` | Vertical image scrolling |
| `picker` | Selection pickers |
| `slider` | Slider controls |
| `switchControl` | Toggle switches |
| `progressBar` | Progress indicators |
| `checkbox` | Checkbox controls |
| `radioButton` | Radio button controls |
| `table` | Table views |
| `collection` | Collection views |
| `segmentedControl` | Segmented controls |
| `stepper` | Stepper controls |
| `datePicker` | Date pickers |
| `timePicker` | Time pickers |
| `searchBar` | Search bars |
| `webView` | Web view components |
| `scrollView` | Scroll views |
| `activityIndicator` | Loading indicators |
| `video` | Video elements |
| `videoPlayer` | Video players |
| `audioPlayer` | Audio players |
| `map` | Map components |
| `tabBar` | Tab bar components |
| `tabBarPage` | Tab bar pages |
| `tabBarPageTitle` | Tab bar page titles |
| `tabBarPageSubtitle` | Tab bar page subtitles |
| `toolbar` | Toolbar components |
| `alert` | Alert dialogs |
| `alertTitle` | Alert titles |
| `alertSubtitle` | Alert subtitles |
| `modal` | Modal dialogs |
| `toast` | Toast notifications |
| `badge` | Badge elements |
| `dropdown` | Dropdown menus |
| `card` | Card components |
| `chip` | Chip elements |
| `grid` | Grid layouts |
| `custom` | Custom elements |

### Available Event Actions

| Action | Description |
|--------|-------------|
| `click` | Element clicked |
| `view` | Element viewed |
| `appear` | Element appeared |
| `disappear` | Element disappeared |
| `swipe` | Swipe gesture |
| `scroll` | Scroll action |
| `drag` | Drag action |
| `drop` | Drop action |
| `tap` | Tap gesture |
| `doubleTap` | Double tap gesture |
| `longPress` | Long press gesture |
| `pinch` | Pinch gesture |
| `zoom` | Zoom action |
| `rotate` | Rotate action |
| `submit` | Form submission |
| `select` | Selection action |
| `deselect` | Deselection action |
| `hover` | Hover action |
| `focus` | Focus action |
| `blur` | Blur action |
| `input` | Input action |
| `valueChange` | Value change |
| `dragStart` | Drag start |
| `dragEnd` | Drag end |
| `load` | Load action |
| `unload` | Unload action |
| `refresh` | Refresh action |
| `play` | Play action |
| `pause` | Pause action |
| `stop` | Stop action |
| `seek` | Seek action |
| `error` | Error action |
| `success` | Success action |
| `cancel` | Cancel action |
| `retry` | Retry action |
| `share` | Share action |
| `open` | Open action |
| `close` | Close action |
| `expand` | Expand action |
| `collapse` | Collapse action |
| `edit` | Edit action |
| `custom` | Custom action |

## Comprehensive Example Usage

Here's a complete example showing how to integrate Moveo Analytics in a React Native app:

```jsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput 
} from 'react-native';
import { 
  MoveoOne, 
  MoveoButton, 
  MoveoText, 
  MoveoTextInput,
  MoveoFlatList,
  TYPE,
  ACTION 
} from 'moveo-one-analytics-react-native';

// Initialize Moveo once at app entry
const moveoInstance = MoveoOne.getInstance("YOUR_API_KEY");

export default function App() {
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    // Core initialization that should run once
    moveoInstance.setLogging(true);
    moveoInstance.setFlushInterval(20000);
    
    // Start session with context
moveoInstance.start("main_screen", {
  test: "a",
  locale: "eng"
});

// Update additional metadata
moveoInstance.updateAdditionalMetadata({
  user_country: "US",
  company: "example_company"
});
  }, []);

  const handleButtonPress = (buttonName) => {
    moveoInstance.track("main_screen", {
      semanticGroup: "user_interactions",
      id: "main_button",
      type: TYPE.BUTTON,
      action: ACTION.CLICK,
      value: "primary_action",
      metadata: {
        source: "home_screen",
        button: buttonName,
      },
    });
    console.log(`${buttonName} clicked!`);
  };

  const handleInputSubmit = () => {
    moveoInstance.track("main_screen", {
      semanticGroup: "user_interactions",
      id: "main_input",
      type: TYPE.TEXT_EDIT,
      action: ACTION.INPUT,
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
            onPress={() => handleButtonPress("Button One")}
          >
            <Text style={styles.buttonText}>Button One</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleButtonPress("Button Two")}
          >
            <Text style={styles.buttonText}>Button Two</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setInputText}
          value={inputText}
          onSubmitEditing={handleInputSubmit}
          placeholder="Type something..."
          placeholderTextColor="#a0aec0"
        />
      </View>
    </View>
  );
}

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
```

## Prediction API

The MoveoOne library includes a prediction method that allows you to get real-time predictions from your trained models using the current user's session data.

### Basic Usage

```jsx
// Make sure to start a session first
moveoInstance.start("app_context", {
  version: "1.0.0",
  environment: "production"
});

// Get prediction from a model
const result = await moveoInstance.predict("your-model-id");

if (result.success) {
  console.log("Prediction probability:", result.prediction_probability);
  console.log("Binary result:", result.prediction_binary);
} else if (result.status === "pending") {
  console.log("Model loading, please try again");
} else {
  console.log("Error:", result.message);
}
```

### Prerequisites

Before using the predict method, ensure:

1. **Session is started**: Call `moveoInstance.start()` before making predictions
2. **Valid token**: The MoveoOne instance must be initialized with a valid API token
3. **Model access**: Your token must have access to the specified model

### Method Signature

```jsx
async predict(modelId): Promise<PredictionResponse>
```

**Parameters:**
- `modelId` (string, required): The ID of the model to use for prediction

**Returns:** Promise that resolves to an object

### Response Examples

#### Successful Prediction

```jsx
{
  success: true,
  status: "success",
  prediction_probability: 0.85,
  prediction_binary: true
}
```

#### Pending Model Loading

```jsx
{
  success: false,
  status: "pending",
  message: "Model is loading, please try again"
}
```

#### Error Responses

**Invalid Model ID**
```jsx
{
  success: false,
  status: "invalid_model_id",
  message: "Model ID is required and must be a non-empty string"
}
```

**Not Initialized**
```jsx
{
  success: false,
  status: "not_initialized",
  message: "MoveoOne must be initialized with a valid token before using predict method"
}
```

**No Session Started**
```jsx
{
  success: false,
  status: "no_session",
  message: "Session must be started before making predictions. Call start() method first."
}
```

**Model Not Found**
```jsx
{
  success: false,
  status: "not_found",
  message: "Model not found or not accessible"
}
```

**Server Error**
```jsx
{
  success: false,
  status: "server_error",
  message: "Server error processing prediction request"
}
```

**Network Error**
```jsx
{
  success: false,
  status: "network_error",
  message: "Network error - please check your connection"
}
```

**Request Timeout**
```jsx
{
  success: false,
  status: "timeout",
  message: "Request timed out after 10 seconds"
}
```

### Advanced Usage Example

```jsx
async function getPersonalizedRecommendations(userId) {
  try {
    const prediction = await moveoInstance.predict(`recommendation-model-${userId}`);
    
    if (prediction.success) {
      // Prediction completed successfully
      if (prediction.prediction_binary) {
        return {
          showRecommendations: true,
          confidence: prediction.prediction_probability
        };
      } else {
        return {
          showRecommendations: false,
          reason: "Low confidence prediction"
        };
      }
    } else if (prediction.status === "pending") {
      // Model is still loading
      console.log(prediction.message);
      // Retry after a delay
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await getPersonalizedRecommendations(userId));
        }, 2000);
      });
    } else {
      // Handle errors
      console.error(`Prediction failed: ${prediction.message}`);
      return null;
    }
  } catch (error) {
    console.error("Unexpected error during prediction:", error);
    return null;
  }
}
```

### Error Handling Best Practices

1. **Always check `success` property first** to determine if the operation completed successfully
2. **Check `status` property** to understand the specific outcome (success, pending, error type)
3. **Handle pending states** appropriately - models may need time to load
4. **Implement retry logic** for pending states or network errors
5. **Log errors** for debugging purposes
6. **Provide fallback behavior** when predictions fail

### Notes

- The `predict` method is **non-blocking** and won't affect your application's performance
- All requests have a 10-second timeout to prevent hanging
- The method automatically uses the current session ID from the MoveoOne instance
- **202 responses are normal pending states** - models may need time to load or validate
- The method returns a Promise, so you can use async/await or `.then()/.catch()`

## Obtain API Key

You can find your organization's API token in the [Moveo One App](https://app.moveo.one/). Navigate to your organization settings to retrieve your unique API key.

## Dashboard Access

Once your data is being tracked, you can access your analytics through [Moveo One Dashboard](https://app.moveo.one/). The dashboard provides comprehensive insights into user behavior, interaction patterns, and application performance.

## Support

For any issues or support, feel free to:

- Open an **issue** on our [GitHub repository](https://github.com/divstechnologydev/moveo-analytics-react-native/issues)
- Email us at [**info@moveo.one**](mailto:info@moveo.one)

---

**Note:** This library is designed for React Native applications and requires React Native 0.60.0 or later. Make sure to handle user privacy and data collection in compliance with relevant regulations.
