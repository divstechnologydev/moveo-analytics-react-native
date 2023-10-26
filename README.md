# moveo-analytics-react-native

<div align="center" style="text-align: center">
  <img src="https://github.com/divstechnologydev/moveo-analytics-react-native/assets/6665139/3755d4fc-d4bc-47dd-a543-9c131a38772c" height="150"/>
</div>

####
## Table of Contents
- [Introduction](#introduction)
- [Quick Start Guide](#quick-start-guide)
  - [Install Moveo One Analytics](#1-install-moveo-one-analytics)
  - [Initialize](#2-initialize)
  - [Setup](#3-setup)
  - [Track Data](#4-track-data)
  - [Obtain API KEY](#5-obtain-api-key)
  - [Use Results](#6-use-results)
## Introduction
Welcome to the official Moveo One Analytics React Native library.

Moveo One analytics is the user cognitive-behavioral analytics tool.
moveo-analytics-react-native is SDK for React Native client apps to use Moveo One tools.
## Quick Start Guide
Moveo One React Native SDK is pure JS implementation of Moveo One Analytics tracker
### 1. Install Moveo One Analytics
#### Prerequisites
TBD
#### Steps
1. Under the root folder od your project, install Moveo One SDK
```
npm install moveo-one-analytics-react-native
```
   
### 2. Initialize
To start recording the events you should first initialize your project with the token.
To obtain a token, please contact us at: info@moveo.one and request API token.
We are working on bringing token creation to our dashboard, but for now, due to the early phase, contact us and we will be more than happy to provide you with an API token.
```
import { MoveoOne } from 'moveo-one-analytics-react-native'

const moveoInstance = MoveoOne.getInstance('<TOKEN>');
moveoInstance.identify('<USER_ID>');
```

This means that you are obtaining an instance of a MoveoOne analytics library, initializing with pre-obtained <TOKNE>
<USER_ID> is your tracking unique ID of the user who is using the app in order to create personalized analytics.
It is used on Dashboard and WebHook to deliver you calculated results, so you will need to have the notion of how this user Id correlates with your unique real userID.
Note: Do not provide user-identifiable information to Moveo One - we do not store them, but nonetheless, we don't need that data, so it's better to create custom bindings.

### 3. Setup
You may want to setup other parameters, such as:
```
moveoInstance.setLogging(true);
```
To log responses from Moveo One library

```
moveoInstance.setFlushInterval(20000);
```
To set automatic flush interval in milliseconds.
Note: the available range is [5000, 60000], aka 5s to 1min

### 4. Track Data
In order to track data, we will need to explain a couple of concepts
#### a) Context
The context is usually a single interaction session that a user has with the app.
More precisely, the context is usually a screen. There are no obstacles in creating multi-screen contexts, but for now, we will explain single-screen context.

Context has dual events: start and stop
```
moveoInstance.start('<SCREEN>');
moveoInstance.stop('<SCREEN>')
```
And that is the reason why it's harder to track context across multiple screens.

Usually, you would do the following, when you navigate to a certain screen, just fire up the start event.
Let's call that screen ```form_screen``` where we want to navigate on some button press
```
<Button title='start' onPress={() => {
    const moveoInstance = MoveoOne.getInstance('<TOKEN>');
    moveoInstance.identify('<USER_ID>');
    moveoInstance.start('form_screen');
    onStarted(true);
  }
} />
```

On our form screen, once we submit the form, we will need to stop the context event tracking:
```
<Button title='Finish' onPress={() => {
    moveoOne.stop('form_screen')
    onStarted(false);
}} />
```

#### b) semantic group
Semantic groups are one more level of abstraction.
Imagine that we have several sections in some form:
<div align="center" style="text-align: center">
  <img src="https://github.com/divstechnologydev/moveo-analytics-react-native/assets/6665139/383560c0-6936-468c-bc00-04f9f3e3b83e" height="350"/>
</div>

Those would be three different semantic groups.

Semantic groups are not mandatory, but calculations are much more precise if we abstract some logical sections.
More on how to set up semantic groups is in the following section.

#### c) simple data tracking
Data is tracked from user interaction with React Components and thus, some bindings need to be placed in user interaction places.
Also, the data about how much text we have on the screen needs to be tracked.

First, let's see the harder way:
Note: we are using constants that are given to you in the ```{ KEYS, TYPE, ACTION }``` - you may use them manually, but it is easier like this.
Text Component example
```
import { MoveoOne } from 'moveo-one-analytics-react-native'
import { KEYS, TYPE, ACTION } from 'moveo-one-analytics-react-native'

export default function SOME_SCREEN() {

  ...

  let moveoOne = MoveoOne.getInstance('token')

  useEffect(() => {
         moveoOne.track('form_screen', {
            [KEYS.GROUP]: 'sg_1',
            [KEYS.ELEMENT_ID]: 'text_field_word',
            [KEYS.ACTION]: ACTION.VIEW,
            [KEYS.TYPE]: TYPE.TEXT,
            [KEYS.VALUE]: text1Title.length
        });
    }, []);

```
This tracks how many characters are presented to the user on ```form_screen``` in group ```sg_1``` and what is the id ```text_field_word``` of that element.
This is cumbersome and not that easy - we will see the easier way in a later section.

Button Component example
```
let moveoOne = MoveoOne.getInstance('token')


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
```
This tracks simple button clicks in semantic group ```sg_2```

#### More on tracking data

In order to track the data more easily, here are some useful classes that extend just plain simple react classes. So you can apply styles, custom methods etc... feel free to take a look at implementation so that you can see what they are doing.

```
import { MoveoOne } from 'moveo-one-analytics-react-native'
import { MoveoText } from 'moveo-one-analytics-react-native'
import { MoveoTextInput } from 'moveo-one-analytics-react-native'
import { MoveoFlatList } from 'moveo-one-analytics-react-native'
import { MoveoButton } from 'moveo-one-analytics-react-native'
import { KEYS, TYPE, ACTION } from 'moveo-one-analytics-react-native'

...

<MoveoText semanticGroup='sg_2' elementId='text_field_selection'>Make selection</MoveoText>

...

<MoveoTextInput semanticGroup='sg_2' elementId='text_edit_x' style={styles.textInputSmaller} value={xValue} placeholder='X' onChangeText={
   (enteredText) => {
       YOUR_CUSTOM_METHOD_IF_EXISTS(enteredText);
   }
} />

...

<MoveoButton semanticGroup='sg_3' elementId='selection_C' title='option C' onPress={
   () => {
      YOUR_CUSTOM_BUTTON_CLICK_HANDLER();
   }
} />

...

<MoveoFlatList
   elementId='scroll_view'
   data={listItems}
   onScroll={
     (event) => {
         YOUR_CUSTOM_METHOD_IF_EXISTS
     }
   }
   renderItem={(itemData) => {...

```

As you can see, this is much easier. All you need to remember is to call ```moveoInstance.start('CONTEXT');``` on the screen, prior to the screen you are implementing the Moveo components. And to call stop of course :)
The reason is because of the rendering time and when is executed.

#### Some examples

There is a sample app in the folder ```/Demo``` folder of this repo.
The app has a Welcome screen and one simple form dummy screen, but it illustrates all sorts of behavior and usages.

### 5. Obtain API KEY

#### API KEY

### 6. Use Results

#### Data ingestion

#### Dashboard






Coming soon - in the meantime, to integrate moveo analytics into your React Native project, please contact us at info@moveo.one
