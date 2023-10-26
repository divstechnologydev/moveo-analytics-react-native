import React from 'react';
import { FlatList } from 'react-native';
import { MoveoOne } from './MoveoOne';
import { KEYS, TYPE, ACTION } from './MoveoKeys';


export class MoveoFlatList extends React.Component {
    constructor(props) {
        super(props);
    }

    handleOnScroll = (event) => {
        const tickObject = {
            [KEYS.ELEMENT_ID]: this.props.elementId,
            [KEYS.ACTION]: ACTION.SCROLLED,
            [KEYS.TYPE]: TYPE.SCROLL,
            [KEYS.VALUE]: event.nativeEvent.contentOffset.y
        };

        if (this.props.semanticGroup) {
            tickObject[KEYS.GROUP] = this.props.semanticGroup;
        }
        
        MoveoOne
            .fetchInstance()
            .tick(tickObject);


        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
    }

    render() {
        return(
            <FlatList
                {...this.props}
                onScroll={this.handleOnScroll}
            />
        );
    }
}