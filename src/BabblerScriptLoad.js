// BabblerScriptLoad.js

var React = require('react');

import {Button, ButtonGroup, Glyph} from 'elemental';

import BabblerScript from 'babbler-script-js';
//import BabblerScript from '../../babbler-script-js/src/babbler-script';

const btnStyle = {
  margin: 12
};

// Загрузка скрипта BabblerScript из файла
var BabblerScriptLoad = React.createClass({
    // http://www.material-ui.com/#/components/table
    // https://stackoverflow.com/questions/30730369/reactjs-component-not-rendering-textarea-with-state-variable
    
    getInitialState: function() {
        return {
            scriptState: this.props.babblerScript.state,
            file: '',
            err: ''
        };
    },
    
    componentDidMount: function() {
        this.programStateListener = function(state, err) {
            this.setState({scriptState: state});
        }.bind(this);
        this.props.babblerScript.on(BabblerScript.Event.STATE, this.programStateListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей;
        this.props.babblerScript.removeListener(BabblerScript.Event.STATE, this.programStateListener);
    },
    
    render: function() {
        // разрешим загружать новый скрипт только в том случае, если текущий остановлен
        var stopped = this.state.scriptState === BabblerScript.State.STOPPED
            || this.state.scriptState === BabblerScript.State.ERROR ? true : false;
        
        return (
            <span style={this.props.style}>
                <input id="fileId" type="file" style={{display: 'none'}}
                    onChange={this.load_script}/>
                <Button size="lg" type="primary"
                    onClick={function(){document.getElementById('fileId').click()}}
                    disabled={!stopped}
                    style={btnStyle}>Загрузить</Button>
                <span>{this.state.file}</span>
                
                {this.props.debug ?
                    <Button size="lg" type="primary"
                        onClick={this.load_script_debug}
                        disabled={!stopped}
                        style={btnStyle}>Загрузить (отладка)</Button> : ""}
                
                {this.state.err ? <span><br/>
                    <span style={{color: 'red'}}>err: {this.state.err}</span></span> : ""}
            </span>
        );
    },
    
    load_script: function(e) {
        // https://stackoverflow.com/questions/39941583/electron-open-file-from-menu
        
        var files = e.target.files;
        var f = files[0];
        this.setState({file: f.name});
        
        var reader = new FileReader();
        reader.onload = function (e) {
            var progStr = e.target.result;
            
            // распарсим строку в последовательность команд
            var prog = BabblerScript.parseStr(progStr).program;
            this.props.babblerScript.setProgram(prog);
        }.bind(this);
        reader.readAsBinaryString(f);
        
        // сбросим значение скрытого поля с именем файла, иначе
        // он не разрешит повторно загрузить тот же файл еще раз
        // (не вызовет событие onChange)
        e.target.value = "";
    },
    
    load_script_debug: function() {
        this.props.babblerScript.setProgram([
            {cmd: "step", params: ["x","10000","1000"]}, 
            {cmd: "step", params: ["y","10000","1000"]}, 
            {cmd: "step", params: ["x","-10000","1000", "y","-10000","1000"]}
        ]);
    }
});

// отправляем компонент на публику
module.exports = BabblerScriptLoad;

