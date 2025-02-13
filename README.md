# moveo-analytics-react-native

<div align="center" style="text-align: center">
  <img src="https://github.com/divstechnologydev/moveo-analytics-react-native/assets/6665139/3755d4fc-d4bc-47dd-a543-9c131a38772c" height="150"/>
</div>

## Table of Contents
- [Introduction](#introduction)
- Quick Start Guide
  - [Add Moveo One Analytics](#1-install-moveo-one-analytics)
  - [Initialize](#2-initialize)
  - [Setup](#3-setup)
  - [Track Data](#4-track-data)
  - [Obtain API KEY](#5-obtain-api-key)
  - [Use Results](#6-use-results)

## Introduction

Welcome to the official Moveo One React Native library.

Moveo One analytics is a user cognitive-behavioral analytics tool. moveo-analytics-react-native is an SDK for React Native client apps to use Moveo One tools.

## Quick Start Guide

Moveo One React Native SDK is a pure JavaScript implementation of the Moveo One Analytics tracker.

### 1. Install Moveo One Analytics

#### Prerequisites
- React Native project
- Node.js and npm installed

#### Steps
1. Install the package using npm:
```bash
npm install moveo-analytics-react-native
```

### 2. Initialize

Initialization should be done at your app's entry point. To obtain a token, please contact us at: info@moveo.one and request an API token. We are working on bringing token creation to our dashboard, but for now, due to the early phase, contact us and we will be happy to provide you with an API token.

```javascript
import { MoveoOne } from 'moveo-analytics-react-native';

// Initialize with your token
const moveoInstance = MoveoOne.getInstance('<YOUR_TOKEN>');

// Identify the current user
moveoInstance.identify('<USER_ID>');
```

The `<USER_ID>` is your tracking unique ID for the user who is using the app. It is used on Dashboard and WebHook to deliver calculated results, so you will need to maintain the correlation between this ID and your actual user ID.

Note: Do not provide personally identifiable information to Moveo One - we don't store or need that data, so it's better to use anonymous identifiers.

### 3. Setup

Configure additional parameters as needed:

```javascript
// Enable logging for development
moveoInstance.setLogging(true);

// Set flush interval (in milliseconds)
moveoInstance.setFlushInterval(20000); // Valid range: 5000-60000 (5s to 1min)
```

### 4. Track Data

#### Context Management

A context represents a user interaction session, typically mapping to a screen or flow in your app:

```javascript
// Start tracking a context
moveoInstance.start('checkout_flow', {
  version: '1.0.0',
  abTest: 'variant_a'
});

// Update context metadata
moveoInstance.updateSessionMetadata({
  step: 'payment_details'
});
```

#### Tracking Events

Track user interactions and view data:

```javascript
// Track a button click
moveoInstance.track('checkout_flow', {
  semanticGroup: 'payment_section',
  id: 'submit_button',
  type: 'button',
  action: 'click',
  value: 'submit',
  metadata: { step: 'final' }
});

// Track text view
moveoInstance.tick({
  semanticGroup: 'payment_section',
  id: 'total_amount',
  type: 'text',
  action: 'view',
  value: '199.99',
  metadata: { currency: 'USD' }
});
```

#### Using Moveo Components

We provide wrapped React Native components for easier tracking:

```javascript
import { 
  MoveoText, 
  MoveoTextInput, 
  MoveoButton, 
  MoveoFlatList 
} from 'moveo-analytics-react-native';

// Text component with automatic tracking
<MoveoText 
  semanticGroup="header_section" 
  elementId="welcome_text"
>
  Welcome to our app
</MoveoText>

// Input with tracking
<MoveoTextInput
  semanticGroup="form_section"
  elementId="email_input"
  value={email}
  onChangeText={setEmail}
/>

// Button with automatic click tracking
<MoveoButton
  semanticGroup="actions"
  elementId="submit_button"
  title="Submit"
  onPress={handleSubmit}
/>
```

### 5. Obtain API KEY

Contact info@moveo.one to obtain your API key. Include your:
- Company name
- Project description
- Expected usage volume

### 6. Use Results

#### Data Format

Events are sent to our API in the following format:

```javascript
{
  events: [{
    c: "context_name",
    type: "track",
    userId: "user_123",
    t: 1234567890,
    prop: {
      sg: "semantic_group",
      eID: "element_id",
      eA: "action",
      eT: "type",
      eV: "value"
    },
    meta: {
      // Custom metadata
    },
    sId: "session_id"
  }]
}
```

#### Dashboard Access

Once your data is being tracked, you can access your analytics through:
1. Moveo One Dashboard https://app.moveo.one/
2. Direct API access
3. Webhook integrations

For more detailed documentation and support, please contact us at info@moveo.one
