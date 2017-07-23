// BabblerScriptControlBar.js

var React = require('react');

import {Button, ButtonGroup, Glyph} from 'elemental';

import Babbler from 'babbler-js';
import BabblerScript from 'babbler-script-js';
//import BabblerScript from '../../babbler-script-js/src/babbler-script';

const btnStyle = {
  margin: 12,
  paddingLeft: "0.6em",
  paddingRight: "0.6em"
};

const iconStyle = {
  fill: "white",
  stroke: "none"
}

// Управление ходом выполнения скрипта BabblerScript
var BabblerScriptControlBar = React.createClass({

    getInitialState: function() {
        return {
            deviceStatus: this.props.babblerScript.babbler.deviceStatus,
            scriptState: this.props.babblerScript.state,
            err: ''
        };
    },
    
    componentDidMount: function() {
        // слушаем статус устройства
        this.deviceStatusListener = function(status) {
            this.setState({deviceStatus: status});
        }.bind(this);
        this.programStateListener = function(state, err) {
            this.setState({scriptState: state});
        }.bind(this);
        
        this.props.babblerScript.babbler.on(Babbler.Event.STATUS, this.deviceStatusListener);
        this.props.babblerScript.on(BabblerScript.Event.STATE, this.programStateListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerScript.babbler.removeListener(Babbler.Event.STATUS, this.deviceStatusListener);
        this.props.babblerScript.removeListener(BabblerScript.Event.STATE, this.programStateListener);
    },
    
    render: function() {
        var connected = this.state.deviceStatus === Babbler.Status.CONNECTED ? true : false;
        
        return (
            <span style={{...this.props.style, textAlign: "center"}}>
                <Button size="lg" type="danger"
                    onClick={this.script_stop}
                    disabled={!connected}
                    style={btnStyle}>
                        <svg version="1.0"
                                width="20" height="20"
                                viewBox="0 0 265 265">
                            {/* Unicode Character 'BLACK SQUARE FOR STOP' (U+23F9)
                              * http://www.fileformat.info/info/unicode/char/23f9/index.htm */}
                            <path d="M196.875 287.1562 L34.875 287.1562 L34.875 125.1562 L196.875 125.1562 L196.875 287.1562 Z"
                                style={iconStyle}/>
                        </svg>
                </Button>
                
                {this.state.scriptState === BabblerScript.State.STOPPED ?
                    <Button size="lg" type="primary"
                        onClick={this.script_start}
                        disabled={!connected}
                        style={btnStyle}>
                            <svg version="1.0"
                                    width="20" height="20"
                                    viewBox="0 40 250 250">
                                {/* Unicode Character 'BLACK MEDIUM RIGHT-POINTING TRIANGLE' (U+23F5)
                                  * http://www.fileformat.info/info/unicode/char/23f5/index.htm */}
                                <path d="M160.875 202.5 L70.875 292.5 L70.875 112.5 L160.875 202.5 Z"
                                    style={iconStyle}/>
                            </svg>
                    </Button> : ""}
                {this.state.scriptState === BabblerScript.State.RUNNING ?
                    <Button size="lg" type="primary"
                        onClick={this.script_pause}
                        disabled={!connected}
                        style={btnStyle}>
                            <svg version="1.0"
                                    width="20" height="20"
                                    viewBox="0 0 265 265">
                                {/* Unicode Character 'DOUBLE VERTICAL BAR' (U+23F8)
                                  * http://www.fileformat.info/info/unicode/char/23f8/index.htm */}
                                <path d="M169.875 301.5 L133.875 301.5 L133.875 121.5 L169.875 121.5 L169.875 301.5 ZM97.875 301.5 L61.875 301.5 L61.875 121.5 L97.875 121.5 L97.875 301.5 Z"
                                    style={iconStyle}/>
                            </svg>
                    </Button> : ""}
                {this.state.scriptState === BabblerScript.State.PAUSED ||
                        this.state.scriptState === BabblerScript.State.ERROR ?
                    <Button size="lg" type="primary"
                        onClick={this.script_resume}
                        disabled={!connected}
                        style={btnStyle}>
                            <svg version="1.0"
                                    width="20" height="20"
                                    viewBox="0 40 250 250">
                                {/* Unicode Character 'BLACK MEDIUM RIGHT-POINTING TRIANGLE' (U+23F5)
                                  * http://www.fileformat.info/info/unicode/char/23f5/index.htm */}
                                <path d="M160.875 202.5 L70.875 292.5 L70.875 112.5 L160.875 202.5 Z"
                                    style={iconStyle}/>
                            </svg>
                    </Button> : ""}
            </span>
        );
    },
    
    script_start: function() {
        this.props.babblerScript.runProgram();
    },
    script_stop: function() {
        this.props.babblerScript.stop();
    },
    script_pause: function() {
        this.props.babblerScript.pause();
    },
    script_resume: function() {
        this.props.babblerScript.resume();
    }
});

// отправляем компонент на публику
module.exports = BabblerScriptControlBar;

