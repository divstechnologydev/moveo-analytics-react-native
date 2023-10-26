import { Text, Button, View, StyleSheet } from 'react-native';
import { MoveoOne } from 'moveo-one-analytics-react-native'


function WelcomeScreen({ onStarted }) {
    return (
        <View>
            <Text> Welcome Screen </Text>
            <Button title='start' onPress={() => {
                const moveoInstance = MoveoOne.getInstance('testapikey');
                moveoInstance.identify('test_user_id');
                moveoInstance.setLogging(true);
                moveoInstance.setFlushInterval(20000);
                moveoInstance.start('form_screen');
                onStarted(true);
            }
            } />
        </View>
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 60,
    },
  });


  