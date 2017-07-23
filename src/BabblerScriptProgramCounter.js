// BabblerScriptProgramCounter.js

var React = require('react');

import BabblerScript from 'babbler-script-js';
//import BabblerScript from '../../babbler-script-js/src/babbler-script';


// Счетчик программы pc (program counter) BabblerScript
var BabblerScriptProgramCounter = React.createClass({

    getInitialState: function() {
        return {
            pc: this.props.babblerScript.programCounter
        };
    },
    
    componentDidMount: function() {
        this.programCounterListener = function(pc) {
            this.setState({pc: pc});
        }.bind(this);
        
        this.props.babblerScript.on(BabblerScript.Event.PROGRAM_COUNTER, this.programCounterListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerScript.removeListener(BabblerScript.Event.PROGRAM_COUNTER, this.programCounterListener);
    },
    
    render: function() {
        
        return (
            <span style={this.props.style}>pc={this.state.pc}</span>
        );
    }
});

// отправляем компонент на публику
module.exports = BabblerScriptProgramCounter;

