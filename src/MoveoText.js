import React from 'react';
import { Text } from 'react-native';
import { MoveoOne } from './MoveoOne';
import { KEYS, TYPE, ACTION } from './MoveoKeys';

export class MoveoText extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.onMount();
    }

    onMount(title) {
        const tickObject = {
            [KEYS.ELEMENT_ID]: this.props.elementId,
            [KEYS.ACTION]: ACTION.VIEW,
            [KEYS.TYPE]: TYPE.TEXT,
            [KEYS.VALUE]: this.props.children.length
        };
        if (this.props.semanticGroup) {
            tickObject[KEYS.GROUP] = this.props.semanticGroup;
        }
        MoveoOne
            .fetchInstance()
            .tick(tickObject);
    }

    render() {
        return (
          <Text {...this.props}>
            {this.props.children}
          </Text>
        );
      }
}