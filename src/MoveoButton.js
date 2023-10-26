import React from 'react';
import { Button } from 'react-native';
import { MoveoOne } from './MoveoOne'
import { KEYS, TYPE, ACTION } from './MoveoKeys';


export class MoveoButton extends React.Component {
    constructor(props) {
        super(props);
    }

    handlePress = () => {
        const tickObject = {
            [KEYS.ELEMENT_ID]: this.props.elementId,
            [KEYS.ACTION]: ACTION.CLICK,
            [KEYS.TYPE]: TYPE.BUTTON
        };

        if (this.props.title) {
            tickObject[KEYS.VALUE] = this.props.title.length;
        }

        if (this.props.semanticGroup) {
            tickObject[KEYS.GROUP] = this.props.semanticGroup;
        }
        
        MoveoOne
            .fetchInstance()
            .tick(tickObject);


        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    render() {
        return(
            <Button
                {...this.props}
                onPress={this.handlePress}
            />
        );
    }
}

