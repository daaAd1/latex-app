import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import Arrow from './Arrow';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TaylorCell
**
*/

/*
Komponent, ktorý má na starosti vstupný text pri Taylorovych diagramoch.
*/

/*
Komponent dostáva od rodiča číslo riadku, číslo stĺpca a text v poli.
Pri zmene textu, šípky, alebo nejakej vlastnosti šípky posiela rodičovi nový text, riadok a stĺpec
alebo text šípky, smer šípky a typ šípky.
*/

/*  global console: false, */

class TaylorCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      cellText: props.cellText,
      arrowObject: JSON.parse(props.arrowObject),
    };

    this.cellTextChanged = this.cellTextChanged.bind(this);
    this.arrowStateChanged = this.arrowStateChanged.bind(this);
    this.arrowDeleted = this.arrowDeleted.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cellText !== this.state.cellText) {
      this.setState({
        cellText: nextProps.cellText,
      });
    }
    if (nextProps.arrowObject !== JSON.stringify(this.state.arrowObject)) {
      this.setState({
        arrowObject: JSON.parse(nextProps.arrowObject),
      });
    }
  }

  cellTextChanged(event) {
    this.setState({
      cellText: event.target.value,
    });
    this.props.cellTextChanged(event.target.value, this.state.row, this.state.column);
  }

  arrowStateChanged(direction, text, text2, type) {
    this.props.arrowStateChanged(direction, text, text2, type);
  }

  arrowDeleted(direction) {
    this.props.arrowDeleted(direction);
  }

  render() {
    const { lu, u, ru, l, r, ld, d, rd } = this.state.arrowObject;
    return (
      <div className="taylor-cell-container">
        <div className="taylor-arrow-container">
          <Arrow
            arrowActive={lu.active}
            arrowText={lu.text}
            arrowText2={lu.text2}
            arrowDirection="lu"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={u.active}
            arrowText={u.text}
            arrowText2={u.text2}
            arrowDirection="u"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={ru.active}
            arrowText={ru.text}
            arrowText2={ru.text2}
            arrowDirection="ru"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={l.active}
            arrowText={l.text}
            arrowText2={l.text2}
            arrowDirection="l"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={r.active}
            arrowText={r.text}
            arrowText2={r.text2}
            arrowDirection="r"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={ld.active}
            arrowText={ld.text}
            arrowText2={ld.text2}
            arrowDirection="ld"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={d.active}
            arrowText={d.text}
            arrowText2={d.text2}
            arrowDirection="d"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowActive={rd.active}
            arrowText={rd.text}
            arrowText2={rd.text2}
            arrowDirection="rd"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
        </div>
        <TextareaAutosize
          type="text"
          value={this.state.cellText}
          className="taylor-cell-input"
          onChange={this.cellTextChanged}
        />
      </div>
    );
  }
}

export default TaylorCell;
