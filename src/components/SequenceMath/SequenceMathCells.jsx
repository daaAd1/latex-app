import React from 'react';
import PropTypes from 'prop-types';
import SequenceMathLine from './SequenceMathLine';

class SequenceMathCells extends React.PureComponent {
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

  isLengthGreaterThanZeroOnPosition(position) {
    if (this.props.linesLength !== undefined && this.props.linesLength[position] !== undefined) {
      return this.props.linesLength[position] > 0;
    }
    return false;
  }

  getLengthOnPosition(position) {
    if (this.props.linesLength !== undefined && this.props.linesLength[position] !== undefined) {
      return Number(this.props.linesLength[position]);
    }
    return 0;
  }

  getAnnotationTextOnPosition(position) {
    if (this.props.annotations !== undefined && this.props.annotations[position] !== undefined) {
      return this.props.annotations[position];
    }
    return '';
  }

  getTextOnPosition(position) {
    if (this.props.linesText !== undefined && this.props.linesText[position] !== undefined) {
      return this.props.linesText[position];
    }
    return '';
  }

  checkIfParentHasText(parentPosition) {
    return (
      this.props.linesText !== undefined &&
      this.props.linesText[parentPosition] !== undefined &&
      this.props.linesText[parentPosition] !== ''
    );
  }

  pushCell(level, cell) {
    const { linesLength } = this.props;
    const position = level.toString() + cell.toString();
    let positionOneLevelDown = (level - 1).toString() + (cell / 2).toString();
    let levelNotHighEnough = false;

    if ((cell + 2) % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + ((cell + 2) / 3).toString();
      if (linesLength[positionOneLevelDown] < 1) {
        levelNotHighEnough = true;
      }
    } else if ((cell + 1) % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + ((cell + 1) / 3).toString();
      if (linesLength[positionOneLevelDown] < 2) {
        levelNotHighEnough = true;
      }
    } else if (cell % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + (cell / 3).toString();
      if (linesLength[positionOneLevelDown] < 3) {
        levelNotHighEnough = true;
      }
    }
    console.log(positionOneLevelDown);

    const doesParentHaveText = !this.checkIfParentHasText(positionOneLevelDown);
    const text = this.getTextOnPosition(position);
    const annotationShown = this.isLengthGreaterThanZeroOnPosition(position);
    const annotationText = this.getAnnotationTextOnPosition(position);
    const length = this.getLengthOnPosition(position);

    if (!levelNotHighEnough && linesLength !== null && linesLength[position] > 0) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            white={false}
            inputText={text}
            length={length}
            level={level}
            cell={cell}
            onTextChange={this.props.onTextChange}
            onLengthChange={this.props.onLineLengthChange}
            onAnnotationChange={this.props.onAnnotationChange}
            annotationText={annotationText}
            annotation={annotationShown}
            clicked
            readonlyText={doesParentHaveText}
          />
        </div>
      );
    } else if (
      !levelNotHighEnough &&
      linesLength[positionOneLevelDown] !== undefined &&
      linesLength[positionOneLevelDown] > 0
    ) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            white={false}
            level={level}
            cell={cell}
            inputText={text}
            length={length}
            annotation={annotationShown}
            onTextChange={this.props.onTextChange}
            onLengthChange={this.props.onLineLengthChange}
            onAnnotationChange={this.props.onAnnotationChange}
            annotationText={annotationText}
            clicked={false}
            readonlyText={doesParentHaveText}
          />
        </div>
      );
    } else if (level === 0) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            white={false}
            level={level}
            cell={cell}
            inputText={text}
            length={length}
            annotation={annotationShown}
            onTextChange={this.props.onTextChange}
            onLengthChange={this.props.onLineLengthChange}
            onAnnotationChange={this.props.onAnnotationChange}
            annotationText={annotationText}
            clicked={false}
            readonlyText={doesParentHaveText}
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
          clicked={false}
          length={0}
          inputText=""
        />
      </div>
    );
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
