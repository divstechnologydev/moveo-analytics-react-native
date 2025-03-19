# React Native Example Applications

This folder contains example applications demonstrating React Native app integration with moveo-one-analytics-react-native.

## Project Structure

- **SimpleDemoApp**: A basic React Native project created with Expo.

## How to Run

### Prerequisites

- **Node.js** (LTS recommended)
- **Expo CLI** installed globally:
  ```bash
  npm install -g expo-cli
  ```
- React Native development environment set up. Follow the React Native CLI Quickstart guide:
  [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

### Getting Started

1. Navigate to the project folder:

   ```bash
   cd examples/SimpleDemoApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. If using iOS, install CocoaPods dependencies:

   ```bash
   cd ios && pod install && cd ..
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

### Running on Devices/Emulators

- To run the app on iOS:
  ```bash
  npx expo run:ios
  ```
- To run the app on Android:
  ```bash
  npx expo run:android
  ```
- To run the app in a web browser:
  ```bash
  npm run web
  ```

## Additional Information

For more details on Expo and React Native development, visit:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
