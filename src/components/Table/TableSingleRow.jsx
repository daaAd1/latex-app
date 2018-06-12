import React from 'react';
import PropTypes from 'prop-types';

class TableSingleRow extends React.PureComponent {
  render() {
    const { row, classValue, cellArray } = this.props;
    return (
      <tr key={row} className={classValue}>
        {cellArray}
      </tr>
    );
  }
}

TableSingleRow.propTypes = {
  row: PropTypes.number.isRequired,
  classValue: PropTypes.string.isRequired,
  cellArray: PropTypes.array.isRequired,
};

export default TableSingleRow;
