import { registerRootComponent } from 'expo';
import { MoveoOne } from 'moveo-one-analytics-react-native';

import App from './App';

// Initialize MoveoOne with API token
const moveoInstance = MoveoOne.getInstance('<YOUR_SDK_TOKEN>');

// Identify the current user
moveoInstance.identify('<USER_ID>');

// Enable logging for development (optional)
moveoInstance.setLogging(true);

// Set data flush interval (default: 20 seconds)
moveoInstance.setFlushInterval(20000);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
