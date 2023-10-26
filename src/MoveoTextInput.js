import React from 'react';
import { TextInput } from 'react-native';
import { MoveoOne } from './MoveoOne';
import { KEYS, TYPE, ACTION } from './MoveoKeys';

export class MoveoTextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    trackOnChange = (event) => {
        if (event.nativeEvent.text) {
            const tickObject = {
                [KEYS.ELEMENT_ID]: this.props.elementId,
                [KEYS.ACTION]: ACTION.CHANGED,
                [KEYS.TYPE]: TYPE.TEXT_INPUT,
                [KEYS.VALUE]: event.nativeEvent.text.length
            };
            if (this.props.semanticGroup) {
                tickObject[KEYS.GROUP] = this.props.semanticGroup;
            }
            MoveoOne
                .fetchInstance()
                .tick(tickObject);
        }

        if (this.props.onChange) {
            this.props.onChange(event)
        }
    };

    render() {
        return (
            <TextInput
                {...this.props}
                onChange={this.trackOnChange}
            />
        )
    }
}