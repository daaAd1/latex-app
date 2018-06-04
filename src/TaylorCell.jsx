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
      text: props.text,
      arrowPropertiesObject: JSON.parse(props.arrowPropertiesObject),
    };

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.text !== this.state.text ||
      nextProps.arrowPropertiesObject !== JSON.stringify(this.state.arrowPropertiesObject)
    ) {
      this.setReceivedProps(nextProps.text, JSON.parse(nextProps.arrowPropertiesObject));
    }
  }

  setReceivedProps(text, arrowPropertiesObject) {
    this.setState({
      text,
    });
    this.setState({
      arrowPropertiesObject,
    });
  }

  handleTextChange(event) {
    const text = event.target.value;
    this.setState({
      text,
    });
    this.props.onTextChange(text, this.state.row, this.state.column);
  }

  render() {
    const { lu, u, ru, l, r, ld, d, rd } = this.state.arrowPropertiesObject;
    return (
      <div className="taylor-cell-container">
        <div className="taylor-arrow-container">
          <Arrow
            isActive={lu.active}
            text={lu.text}
            text2={lu.text2}
            direction="lu"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={u.active}
            text={u.text}
            text2={u.text2}
            direction="u"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={ru.active}
            text={ru.text}
            text2={ru.text2}
            direction="ru"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={l.active}
            text={l.text}
            text2={l.text2}
            direction="l"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={r.active}
            text={r.text}
            text2={r.text2}
            direction="r"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={ld.active}
            text={ld.text}
            text2={ld.text2}
            direction="ld"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={d.active}
            text={d.text}
            text2={d.text2}
            direction="d"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            isActive={rd.active}
            text={rd.text}
            text2={rd.text2}
            direction="rd"
            onArrowDelete={(direction) => this.props.onArrowDelete(direction)}
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(direction, text, text2, type)
            }
            row={this.state.row}
            column={this.state.column}
          />
        </div>
        <TextareaAutosize
          type="text"
          value={this.state.text}
          className="taylor-cell-input"
          onChange={this.handleTextChange}
        />
      </div>
    );
  }
}

export default TaylorCell;
