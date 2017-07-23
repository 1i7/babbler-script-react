// BabblerScriptProgram.js

var React = require('react');

import BabblerScript from 'babbler-script-js';
//import BabblerScript from '../../babbler-script-js/src/babbler-script';

// Псевдо-элементы CSS :before и :after не получится использовать напрямую
// из инлайн-стилей React, поэтому придется немного покосоручить
// https://stackoverflow.com/questions/27530462/react-jsx-style-tag-error-on-render
// https://css-tricks.com/examples/ShapesOfCSS/
// http://www.webgranth.com/css-borders-create-border-and-shapes-with-css
// https://css-tricks.com/snippets/css/css-triangle/

// треугольничек справа от номера исполняемой строки
const css = `
.currLineNumber:after {
  position: absolute;
  content: '';
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #5599ff;
}
`
const lineStyle = {
  width: '100%',
  fontSize: 16
}

const currLineStyle = {
  ...lineStyle,
  backgroundColor: '#ffeeaa'
}

const lineNumberStyle = {
  color: 'white',
  backgroundColor: '#5599ff',
  width: 1,
  fontSize: 12,
  textAlign: 'right',
  padding: 3,
  paddingLeft: 5,
  paddingRight: 5
}

const currLineNumberStyle = {
  ...lineNumberStyle
}

const cmdCellStyle = {
}

const currCmdCellStyle = {
  ...cmdCellStyle
}

const cmdStyle = {
  color: "#164450",
  fontWeight: 'bold',
  paddingLeft: 10
}

const currCmdStyle = {
  ...cmdStyle
}

const paramsStyle = {
  color: "#d400aa",
  paddingLeft: 10
}

const currParamsStyle = {
  ...paramsStyle
}

// Программа - скрипт BabblerScript
var BabblerScriptProgram = React.createClass({
    // http://www.material-ui.com/#/components/table
    
    getInitialState: function() {
        return {
            program: this.props.babblerScript.program,
            pc: this.props.babblerScript.programCounter
        };
    },
    
    componentDidMount: function() {
        this.programListener = function(prog) {
            this.setState({program: prog});
        }.bind(this);
        this.programCounterListener = function(pc) {
            this.setState({pc: pc});
        }.bind(this);
        
        this.props.babblerScript.on(BabblerScript.Event.PROGRAM, this.programListener);
        this.props.babblerScript.on(BabblerScript.Event.PROGRAM_COUNTER, this.programCounterListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerScript.removeListener(BabblerScript.Event.PROGRAM, this.programListener);
        this.props.babblerScript.removeListener(BabblerScript.Event.PROGRAM_COUNTER, this.programCounterListener);
    },
    
    render: function() {
        var progLines = [];
        
        // добавим одну пустую нулевую строку (pc=-1), чтобы обозначить, что
        // программа готова к старту
        var currLine = (-1 == this.state.pc);
        progLines.push(
            <div key={-1}
                  style={{display: 'table-row', ...(currLine?currLineStyle:lineStyle)}}>
               <div style={{display: 'table-cell', height: 26, ...(currLine?currLineNumberStyle:lineNumberStyle)}}
                   className={currLine?"currLineNumber":""}></div>
               
               <div style={{display: 'table-cell', ...(currLine?currCmdCellStyle:cmdCellStyle)}}>
               </div>
           </div>
        );
        
        for(var i = 0; i < this.state.program.length; i++) {
            var paramsSeg = [];
            for(var j = 0; j < this.state.program[i].params.length; j++) {
                paramsSeg.push(" " + this.state.program[i].params[j]);
            }
            
            currLine = (i == this.state.pc);
            
            var lineElem =
               <div key={i}
                      style={{display: 'table-row', ...(currLine?currLineStyle:lineStyle)}}>
                   <div style={{display: 'table-cell', ...(currLine?currLineNumberStyle:lineNumberStyle)}}
                       className={currLine?"currLineNumber":""}>{i+1}</div>
                   
                   <div style={{display: 'table-cell', ...(currLine?currCmdCellStyle:cmdCellStyle)}}>
                       <span style={(currLine?currCmdStyle:cmdStyle)}>{this.state.program[i].cmd}</span>
                       <span style={(currLine?currParamsStyle:paramsStyle)}>{paramsSeg}</span>
                   </div>
               </div>
        
            progLines.push(lineElem);
        }
        
        return (
            <div style={{display: 'table', ...this.props.style}}>
                <style>{css}</style>
                {progLines}
            </div>
        );
    }
});

// отправляем компонент на публику
module.exports = BabblerScriptProgram;

