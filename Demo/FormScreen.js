import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { generate, count } from "random-words";
import { MoveoOne } from 'moveo-one-analytics-react-native'
import { MoveoFlatList } from 'moveo-one-analytics-react-native'
import { KEYS, TYPE, ACTION } from 'moveo-one-analytics-react-native'

export default function FormScreen({ onStarted }) {

    const [toDoText, setToDoText] = useState('')
    const [x, setX] = useState('')
    const [randX, setRandX] = useState(getRandomInt(10))
    const [y, setY] = useState('')
    const [randY, setRandY] = useState(getRandomInt(10))
    const [randWord, setRandWord] = useState(generate({ minLength: 5, maxLength: 10 }))
    const [inputValue, setInputValue] = useState('')
    const [xValue, setXValue] = useState('')
    const [yValue, setYValue] = useState('')
    const [listItems, setListItems] = useState([])


    let moveoOne = MoveoOne.getInstance('token')
    // moveoOne.identify('test_user_id');

    const text1Title = 'Re-type following word'
    const text2Title = 'Enter following numbers:' + randX + ' and ' + randY
    const text3Title = 'Make selection'
    const selectionATitle = 'option A'
    const selectionBTitle = 'option B'
    const selectionCTitle = 'option C'

    useEffect(() => {

        // moveoOne.start('form_screen');

        moveoOne.track('form_screen', {
            [KEYS.ELEMENT_ID]: 'form_screen',
            [KEYS.TYPE]: TYPE.SCREEN,
            [KEYS.ACTION]: ACTION.OPENED,
        });

        moveoOne.track('form_screen', {
            [KEYS.GROUP]: 'sg_1',
            [KEYS.ELEMENT_ID]: 'text_field_word',
            [KEYS.ACTION]: ACTION.VIEW,
            [KEYS.TYPE]: TYPE.TEXT,
            [KEYS.VALUE]: text1Title
        });

        moveoOne.tick({
            semanticGroup: 'sg_2',
            elementId: 'text_field_selection',
            type: 'text',
            action: 'view',
            value: text3Title
        });

        moveoOne.tick({
            semanticGroup: 'sg_2',
            elementId: 'text_field_numbers',
            type: 'text',
            action: 'view',
            value: text2Title
        });
    }, []);


    function toDoInputHandler(enteredText) {
        setToDoText(enteredText)
        setInputValue(enteredText)
    };

    function xInputHandler(enteredText) {
        setX(enteredText)
        setXValue(enteredText)
    };


    function yInputHandler(enteredText) {
        setY(enteredText)
        setYValue(enteredText)
    };

    function addToDoHandler() {
        setListItems((currentToDos) => [...currentToDos, { text: toDoText, key: Math.random().toString() }])
        setRandWord(generate({ minLength: 5, maxLength: 10 }))
        setInputValue('')
    };

    function addNumbersHandler() {
        setListItems((currentToDos) => [...currentToDos, { text: x + ' ' + y, key: Math.random().toString() }])
        setRandX(getRandomInt(10))
        setRandY(getRandomInt(10))
        setXValue('')
        setYValue('')
    };

    function addOptionA() {
        setListItems((currentToDos) => [...currentToDos, { text: 'opition A', key: Math.random().toString() }])
    };

    function addOptionB() {
        setListItems((currentToDos) => [...currentToDos, { text: 'opition B', key: Math.random().toString() }])
    };

    function addOptionC() {
        setListItems((currentToDos) => [...currentToDos, { text: 'opition C', key: Math.random().toString() }])
    };

    function removeNumber(id) {
        console.log(id)
        setListItems(listItems.filter(value => value.key != id))
    };



    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }


    return (
        <View style={styles.wrapper}>
            <Text>This is the test view for Moveo One analytics tool</Text>
            <Text>We want to log user actions during this view</Text>
            <View style={styles.inputWrapper}>
                <Text>{text1Title}</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.textInput} value={inputValue} placeholder={randWord} onChangeText={
                        (enteredText) => {
                            toDoInputHandler(enteredText);
                            moveoOne.track('form_screen', {
                                semanticGroup: 'sg_1',
                                elementId: 'text_edit_word',
                                action: 'change',
                                type: 'text_input',
                                value: enteredText.length
                            })
                        }

                    } />
                    <Button title='Add' onPress={() => {
                        addToDoHandler()
                        moveoOne.track('form_screen', {
                            semanticGroup: 'sg_1',
                            elementId: 'button_add',
                            type: 'button',
                            action: 'click'
                        })
                    }} />
                </View>
            </View>


            <View style={styles.inputWrapper}>
                <Text>{text2Title}</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.textInputSmaller} value={xValue} placeholder='X' onChangeText={
                        (enteredText) => {
                            xInputHandler(enteredText);
                            moveoOne.tick({
                                semanticGroup: 'sg_2',
                                elementId: 'text_edit_x',
                                action: 'change',
                                type: 'text_input',
                                value: enteredText.length
                            })
                        }
                    } />

                    <TextInput style={styles.textInputSmaller} value={yValue} placeholder='Y' onChangeText={
                        (enteredText) => {
                            yInputHandler(enteredText);
                            moveoOne.track('form_screen', {
                                semanticGroup: 'sg_2',
                                elementId: 'text_edit_y',
                                action: 'change',
                                type: 'text_input',
                                value: enteredText.length
                            })
                        }

                    } />
                    <Button title='Add numbers' onPress={
                        () => {
                            addNumbersHandler();
                            moveoOne.track('form_screen', {
                                semanticGroup: 'sg_2',
                                elementId: 'button_add_numbers',
                                type: 'button',
                                action: 'click'
                            });
                        }
                    } />
                </View>
            </View>


            <View style={styles.inputWrapper}>
                {/* <Text>{text3Title}</Text> */}
                <Text>Make selection</Text>
                
                <View style={styles.selectionContainer}>
                    <Button title={selectionATitle} onPress={
                        () => {
                            addOptionA();
                            moveoOne.track('form_screen', {
                                semanticGroup: 'sg_3',
                                elementId: 'selection_A',
                                action: 'click',
                                type: 'button',
                                value: selectionATitle,
                            });
                        }
                    } />
                    <Button title={selectionBTitle} onPress={
                        () => {
                            addOptionB();
                            moveoOne.track('form_screen', {
                                semanticGroup: 'sg_3',
                                elementId: 'selection_B',
                                action: 'click',
                                type: 'button',
                                value: selectionBTitle,
                            });
                        }

                    } />
                    <Button title='option C' onPress={
                        () => {
                            addOptionC();
                            moveoOne.tick({
                                semanticGroup: 'sg_3',
                                elementId: 'selection_C',
                                action: 'click',
                                type: 'button',
                                value: selectionCTitle,
                            });
                        }

                    } />
                </View>
            </View>


            <View style={styles.goalsContainer}>
                {/* <ScrollView>
        {courseGoals.map((goal) => 
        ( 
          <View style={styles.goalItem} key={goal}>
            <Text style={styles.goalText}>{goal}</Text>
          </View>
        ))
        }
        </ScrollView> */}

                <MoveoFlatList
                    elementId='scroll_view'
                    data={listItems}
                    onScroll={
                        (event) => {
                            console.log('some custom scroll handle if exists')
                        }
                    }
                    renderItem={(itemData) => {
                        return (
                            <View style={styles.cellContainer}>
                                <View style={styles.goalItem}>
                                    <Text style={styles.goalText}>{itemData.item.text}</Text>
                                </View>
                                <Button title='remove' onPress={() => {
                                    removeNumber(itemData.item.key);
                                    moveoOne.track('form_screen', {
                                        semanticGroup: 'sg_4',
                                        elementId: itemData.item.key,
                                        action: 'click',
                                        type: 'button',
                                    });
                                }
                                } />
                            </View>
                        );
                    }} />
            </View>

            <View style={styles.inputWrapper}>
                <Button title='Finish' onPress={() => {
                    moveoOne.stop('form_screen')
                    onStarted(false);
                }} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    inputWrapper: {
        flex: 1,
        marginTop: 12,
        paddingTop: 6
    },

    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },

    selectionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },

    cellContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textInput: {
        borderWidth: 1,
        borderColor: '#cccccc',
        width: '70%',
        marginRight: 8,
        padding: 8,
    },

    textInputSmaller: {
        borderWidth: 1,
        borderColor: '#cccccc',
        width: '20%',
        marginRight: 8,
        padding: 8,
    },

    goalsContainer: {
        flex: 4
    },

    goalItem: {
        margin: 8,
        borderRadius: 6,
        backgroundColor: '#5e0acc',
        padding: 8,
    },

    goalText: {
        color: 'white'
    }
});
