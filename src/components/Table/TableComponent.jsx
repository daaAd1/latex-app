import React from 'react';

class TableComponent extends React.Component {
  render() {
    const rows = [];
    for (let row = -1; row < this.state.rows; row += 1) {
      const cell = [];
      for (let column = 0; column < this.state.columns; column += 1) {
        const cellId = `cell${row}-${column}`;
        const stringId = `${row}-${column}`;
        const columnId = column.toString();
        const borderActive = this.state.bordersObject[stringId];
        let hoverActive = this.state.hoverObject[stringId];
        if (typeof hoverActive === 'object') {
          hoverActive = false;
        }
        const alignment = this.state.alignmentsObject[columnId];
        if (row === -1) {
          if (column % 2 !== 0) {
            cell.push(
              <TableAlignmentCell
                key={cellId}
                column={column}
                alignment={alignment}
                onClick={(alignment) => this.addAlignmentToObject(column, alignment)}
              />,
            );
          }
        } else if (row === 0) {
          if (column % 2 === 0) {
            cell.push(
              <TableBorderCell
                key={cellId}
                row={row}
                column={column}
                active={borderActive}
                hover={hoverActive}
                direction="column"
                onClick={this.selectBorder.bind(this, row, column, 'column')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'column', true)}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'column', false)}
              />,
            );
          } else {
            cell.push(
              <TableBorderCell
                key={cellId}
                row={row}
                column={column}
                direction="row"
                active={borderActive}
                hover={hoverActive}
                onClick={this.selectBorder.bind(this, row, column, 'row')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'row', true)}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'row', false)}
              />,
            );
          }
        } else if (row % 2 === 0) {
          if (column % 2 === 0) {
            cell.push(
              <TableBorderCell
                key={cellId}
                onClick={this.selectBorder.bind(this, row, column, 'column')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'column')}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'column', false)}
                row={row}
                column={column}
                active={borderActive}
                hover={hoverActive}
                direction="column"
              />,
            );
          } else {
            cell.push(
              <TableBorderCell
                key={cellId}
                onClick={this.selectBorder.bind(this, row, column, 'row')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'row', true)}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'row', false)}
                row={row}
                column={column}
                active={borderActive}
                hover={hoverActive}
                direction="row"
              />,
            );
          }
        } else if (column % 2 === 0) {
          cell.push(
            <TableBorderCell
              key={cellId}
              onClick={this.selectBorder.bind(this, row, column, 'column')}
              onMouseEnter={this.hoverBorder.bind(this, row, column, 'column', true)}
              onMouseLeave={this.hoverBorder.bind(this, row, column, 'column', false)}
              active={borderActive}
              hover={hoverActive}
              row={row}
              column={column}
              direction="column"
            />,
          );
        } else {
          let inputText = '';
          if (
            this.state !== undefined &&
            this.state.alignmentsObject !== undefined &&
            this.state.alignmentsObject !== null
          ) {
            if (
              this.state !== undefined &&
              this.state.textsObject !== undefined &&
              this.state.textsObject[stringId] !== undefined
            ) {
              inputText = this.state.textsObject[stringId];
            }
            const alignValue = this.state.alignmentsObject[column];
            cell.push(
              <TableInputCell
                changedText={this.changeText}
                row={row}
                column={column}
                alignment={alignValue}
                text={inputText}
                key={cellId}
              />,
            );
          } else {
            if (this.state !== undefined && this.state.textsObject !== undefined) {
              inputText = this.state.textsObject[stringId];
            }
            cell.push(
              <TableInputCell
                changedText={this.changeText}
                row={row}
                column={column}
                text={inputText}
                alignment="left"
                key={cellId}
              />,
            );
          }
        }
      }
      if (row % 2 === 0) {
        rows.push(
          <TableSingleRow row={row} cellArray={cell} class="borderRow" />,
          /*<tr key={row} className="borderRow">
            {cell}
          </tr>*/
        );
      } else {
        rows.push(
          <TableSingleRow row={row} cellArray={cell} classValue="tr" />,
          /*<tr className="tr" key={row}>
            {cell}
          </tr>*/
        );
      }
    }
  }
  return(
    {rows}
  )
}

export default TableComponent;
