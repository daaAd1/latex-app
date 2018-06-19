import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import closeIcon from '../../img/window-close.svg';
import deleteIcon from '../../img/delete-red.svg';
import ArrowTypes from './ArrowTypes';
import ArrowInputs from './ArrowInputs';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: Arrow
**
*/

/*
Komponent starajúci sa o zobrazenie šípiek v časti Taylorovych diagramov.
Má na starosti zobrazenie jedného typu šípky podľa vstupných parametrov.
Taktiež sa stará o otváranie vyskakujúceho okna, v ktorom je možné šípku upravovať.
Prvý klik šípku označí a aktivuje, 
druhý klik otvorí vyskakujúce okno - v tomto komponente nazvané 'modal'. 
*/

/*  global localStorage: false, console: false */

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

/*
Komponent dostáva od svojho rodiča číslo riadku, číslo stĺpca a smer šípky.
Komponent pri zmene nejakého atribútu šípky posiela rodičovi typ šípky, riadok, stĺpec, text pri šípke
a typ šípky.
*/

class Arrow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isActive: this.getInitialIsActive(),
      isModalOpen: false,
      text: this.getInitialText(1),
      text2: this.getInitialText(2),
      type: this.getIntialType(),
    };

    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteArrow = this.deleteArrow.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isActive, text, text2 } = nextProps;
    if (
      isActive !== this.state.isActive ||
      text !== this.state.text ||
      text2 !== this.state.text2
    ) {
      this.setReceivedProps(isActive, text, text2);
    }
  }

  setReceivedProps(isActive, text, text2) {
    this.setState({
      isActive,
      text,
      text2,
    });
  }

  getInitialIsActive() {
    let active =
      localStorage.getItem(
        `taylor-arrow-active-${this.props.direction}${this.props.row}${this.props.column}`,
      ) || false;
    if (active === 'true') {
      active = true;
    } else {
      active = false;
    }
    return active;
  }

  getInitialText(number) {
    return (
      localStorage.getItem(
        `taylor-arrow-text-${number}-${this.props.direction}${this.props.row}${this.props.column}`,
      ) || ''
    );
  }

  getIntialType() {
    return (
      localStorage.getItem(
        `taylor-arrow-type-${this.props.direction}${this.props.row}${this.props.column}`,
      ) || 'To'
    );
  }

  handleArrowClick() {
    if (this.state.isActive) {
      this.openModal();
    } else {
      this.activateArrow();
    }
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  activateArrow() {
    this.setState(
      {
        isActive: true,
      },
      () => this.updateStateInParent(),
    );
    this.setLocalStorageActive(true);
  }

  updateStateInParent() {
    const { text, text2, type } = this.state;
    const { direction } = this.props;
    this.props.onArrowChange(direction, text, text2, type);
  }

  setLocalStorageActive(value) {
    localStorage.setItem(
      `taylor-arrow-active-${this.props.direction}${this.props.row}${this.props.column}`,
      value,
    );
  }

  deactivateArrow() {
    this.setState(
      {
        isActive: false,
      },
      () => this.props.onArrowDelete(this.props.direction),
    );
    this.setLocalStorageActive(false);
  }

  handleTextChange(text, number) {
    let numberValue = number;
    if (number === 1) {
      numberValue = '';
    }
    this.setState(
      {
        [`text${numberValue}`]: text,
      },
      () => this.updateStateInParent(),
    );
    this.setLocalStorageText(text, number);
  }

  setLocalStorageText(value, number) {
    localStorage.setItem(
      `taylor-arrow-text-${number}-${this.props.direction}${this.props.row}${this.props.column}`,
      value,
    );
  }

  handleTypeChange(event) {
    const type = event.target.value;
    this.setState(
      {
        type,
      },
      () => this.updateStateInParent(),
    );
    this.setLocalStorageType(type);
  }

  setLocalStorageType(value) {
    localStorage.setItem(
      `taylor-arrow-type-${this.props.direction}${this.props.row}${this.props.column}`,
      value,
    );
  }

  deleteArrow() {
    this.closeModal();
    this.deactivateArrow();
  }

  render() {
    let className = '';
    if (this.state.isActive) {
      className = 'arrow-active';
    }
    const arrowTypes = ['To', 'Mapsto', 'Line', 'Into', 'Onto', 'Dotsto', 'Dashto', 'Implies'];
    const arrowTexts = [this.state.text, this.state.text2];
    return (
      <div>
        <button onClick={this.handleArrowClick} className={className}>
          {this.props.direction}
        </button>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Arrow modal"
        >
          <div className="modal-header">
            <h2>Arrow properties</h2>
            <div className="modal-header-buttons">
              <button
                title="Delete arrow"
                className="modal-button-close"
                type="button"
                onClick={this.deleteArrow}
              >
                <img src={deleteIcon} alt="delete-arrow" />
              </button>
              <button
                title="Close modal"
                className="modal-button-close"
                type="button"
                onClick={this.closeModal}
              >
                <img src={closeIcon} alt="close-modal" />
              </button>
            </div>
          </div>
          <form className="modal-container">
            <ArrowInputs
              texts={arrowTexts}
              onTextChange={(text, number) => this.handleTextChange(text, number)}
            />
            <ArrowTypes
              types={arrowTypes}
              currentType={this.state.type}
              onTypeChange={this.handleTypeChange}
            />
          </form>
        </Modal>
      </div>
    );
  }
}

Arrow.propTypes = {
  isActive: PropTypes.bool,
  text: PropTypes.string,
  text2: PropTypes.string,

  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
  onArrowChange: PropTypes.func.isRequired,
  onArrowDelete: PropTypes.func.isRequired,
};

Arrow.defaultProps = {
  isActive: false,
  text: '',
  text2: '',
};

export default Arrow;
