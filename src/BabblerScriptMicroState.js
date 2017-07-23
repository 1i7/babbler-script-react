// BabblerScriptMicroState.js

var React = require('react');

import BabblerScript from 'babbler-script-js';
//import BabblerScript from '../../babbler-script-js/src/babbler-script';

// Микро-состояние скрипта BabblerScript
var BabblerScriptMicroState = React.createClass({

    getInitialState: function() {
        return {
            scriptMicroState: this.props.babblerScript.microState,
            err: ''
        };
    },
    
    componentDidMount: function() {
        this.programMicroStateListener = function(state, err) {
            this.setState({scriptMicroState: state, err: err});
        }.bind(this);
        
        this.props.babblerScript.on(BabblerScript.Event.MICRO_STATE, this.programMicroStateListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerScript.removeListener(BabblerScript.Event.MICRO_STATE, this.programMicroStateListener);
    },
    
    render: function() {
        return (
            <span style={this.props.style}>{this.state.scriptMicroState}</span>
        );
    }
});

// отправляем компонент на публику
module.exports = BabblerScriptMicroState;

