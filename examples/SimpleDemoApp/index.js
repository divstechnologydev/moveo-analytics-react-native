import { registerRootComponent } from 'expo';
import { MoveoOne } from 'moveo-one-analytics-react-native';

const moveoInstance = MoveoOne.getInstance('<YOUR_SDK_TOKEN>');
moveoInstance.identify('<USER_ID>');
moveoInstance.setLogging(true);
moveoInstance.setFlushInterval(20000);

import App from './App';

registerRootComponent(App);
