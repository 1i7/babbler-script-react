// BabblerScriptState.js

var React = require('react');

import BabblerScript from 'babbler-script-js';
//import BabblerScript from '../../babbler-script-js/src/babbler-script';

// Состояние скрипта BabblerScript
var BabblerScriptState = React.createClass({

    getInitialState: function() {
        return {
            scriptState: this.props.babblerScript.state,
            err: ''
        };
    },
    
    componentDidMount: function() {
        this.programStateListener = function(state, err) {
            this.setState({scriptState: state, err: err});
        }.bind(this);
        
        this.props.babblerScript.on(BabblerScript.Event.STATE, this.programStateListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerScript.removeListener(BabblerScript.Event.STATE, this.programStateListener);
    },
    
    render: function() {
        
        return (
            <span style={this.props.style}>{this.state.scriptState}</span>
        );
    }
});

// отправляем компонент на публику
module.exports = BabblerScriptState;

