import React from 'react';
import PropTypes from 'prop-types';
import SequenceMathLine from './SequenceMathLine';

class SequenceMathCells extends React.PureComponent {
  static getParentPosition(level, cell) {
    if (SequenceMathCells.isCellFirstChild(cell)) {
      return (level - 1).toString() + ((cell + 2) / 3).toString();
    } else if (SequenceMathCells.isCellSecondChild(cell)) {
      return (level - 1).toString() + ((cell + 1) / 3).toString();
    }

    return (level - 1).toString() + (cell / 3).toString();
  }

  static isCellFirstChild(cell) {
    return (cell + 2) % 3 === 0;
  }

  static isCellSecondChild(cell) {
    return (cell + 1) % 3 === 0;
  }

  static isCellThirdChild(cell) {
    return cell % 3 === 0;
  }

  constructor(props) {
    super(props);

    this.pushCell = this.pushCell.bind(this);
  }

  createAllLevels() {
    const lines = [];
    lines.push(this.createLevelFour());
    lines.push(this.createLevelThree());
    lines.push(this.createLevelTwo());
    lines.push(this.createLevelOne());
    lines.push(this.createLevelZero());
    return lines;
  }

  createLevelFour() {
    return (
      <div key={4} className="sequence-level">
        <br />
        {this.createCellsOnRow(4, 82)}
      </div>
    );
  }

  createCellsOnRow(level, maxCell) {
    const cell = [];
    for (let levelCell = 1; levelCell < maxCell; levelCell += 1) {
      cell.push(this.pushCell(level, levelCell));
    }
    return cell;
  }

  pushCell(level, cell) {
    const { linesLength } = this.props;

    const position = level.toString() + cell.toString();
    const parentPosition = SequenceMathCells.getParentPosition(level, cell);
    const cellShoudDisplay = this.shouldCellDisplay(level, cell, parentPosition);
    const doesParentHaveText = !this.checkIfParentHasText(level, parentPosition);

    const text = this.getTextOnPosition(position);
    const annotationShown = this.isLengthGreaterThanZeroOnPosition(position);
    const annotationText = this.getAnnotationTextOnPosition(position);
    const length = this.getLengthOnPosition(position);

    if (
      level === 0 ||
      (cellShoudDisplay &&
        linesLength !== undefined &&
        linesLength[parentPosition] !== undefined &&
        linesLength[parentPosition] > 0)
    ) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            white={false}
            level={level}
            cell={cell}
            length={length}
            readonlyText={doesParentHaveText}
            inputText={text}
            annotation={annotationShown}
            annotationText={annotationText}
            onTextChange={this.props.onTextChange}
            onLengthChange={this.props.onLineLengthChange}
            onAnnotationChange={this.props.onAnnotationChange}
          />
        </div>
      );
    }
    return (
      <div key={position} className="sequence-level-cells">
        <SequenceMathLine
          white
          level={level}
          cell={cell}
          annotation={false}
          annotationText={annotationText}
          length={0}
          inputText=""
        />
      </div>
    );
  }

  shouldCellDisplay(level, cell, parentPosition) {
    if (SequenceMathCells.isCellFirstChild(cell)) {
      if (this.isCellDefinedAndMinimumLength(1, parentPosition)) {
        return false;
      }
    } else if (SequenceMathCells.isCellSecondChild(cell)) {
      if (this.isCellDefinedAndMinimumLength(2, parentPosition)) {
        return false;
      }
    } else if (SequenceMathCells.isCellThirdChild(cell)) {
      if (this.isCellDefinedAndMinimumLength(3, parentPosition)) {
        return false;
      }
    }

    return true;
  }

  isCellDefinedAndMinimumLength(minLength, position) {
    return (
      this.props.linesLength !== undefined &&
      this.props.linesLength[position] !== undefined &&
      this.props.linesLength[position] < minLength
    );
  }

  checkIfParentHasText(level, parentPosition) {
    return (
      level === 0 ||
      (this.props.linesText !== undefined &&
        this.props.linesText[parentPosition] !== undefined &&
        this.props.linesText[parentPosition] !== '')
    );
  }

  getTextOnPosition(position) {
    if (this.props.linesText !== undefined && this.props.linesText[position] !== undefined) {
      return this.props.linesText[position];
    }
    return '';
  }

  isLengthGreaterThanZeroOnPosition(position) {
    if (this.props.linesLength !== undefined && this.props.linesLength[position] !== undefined) {
      return this.props.linesLength[position] > 0;
    }
    return false;
  }

  getAnnotationTextOnPosition(position) {
    if (this.props.annotations !== undefined && this.props.annotations[position] !== undefined) {
      return this.props.annotations[position];
    }
    return '';
  }

  getLengthOnPosition(position) {
    if (this.props.linesLength !== undefined && this.props.linesLength[position] !== undefined) {
      return Number(this.props.linesLength[position]);
    }
    return 0;
  }

  createLevelThree() {
    return (
      <div key={3} className="sequence-level">
        <br />
        {this.createCellsOnRow(3, 28)}
      </div>
    );
  }

  createLevelTwo() {
    return (
      <div key={2} className="sequence-level">
        <br />
        {this.createCellsOnRow(2, 10)}
      </div>
    );
  }

  createLevelOne() {
    return (
      <div key={1} className="sequence-level">
        <br />
        {this.createCellsOnRow(1, 4)}
      </div>
    );
  }

  createLevelZero() {
    return (
      <div key={0} className="sequence-level">
        <br />
        {this.createCellsOnRow(0, 2)}
      </div>
    );
  }

  render() {
    const lines = this.createAllLevels();
    return <div>{lines}</div>;
  }
}

SequenceMathCells.propTypes = {
  linesText: PropTypes.object.isRequired,
  annotations: PropTypes.object.isRequired,
  linesLength: PropTypes.object.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onLineLengthChange: PropTypes.func.isRequired,
  onAnnotationChange: PropTypes.func.isRequired,
};

export default SequenceMathCells;
