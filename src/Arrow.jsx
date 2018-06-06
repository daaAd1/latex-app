import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import closeIcon from './window-close.svg';
import deleteIcon from './delete-red.svg';

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
      row: props.row,
      column: props.column,
      isActive: this.getInitialIsActive(),
      isModalOpen: false,
      direction: props.direction,
      text: this.getInitialText(),
      text2: this.getInitialTextTwo(),
      type: this.getIntialType(),
    };

    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteArrow = this.deleteArrow.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextTwoChange = this.handleTextTwoChange.bind(this);
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

  getInitialText() {
    return (
      localStorage.getItem(
        `taylor-arrow-text-${this.props.direction}${this.props.row}${this.props.column}`,
      ) || ''
    );
  }

  getInitialTextTwo() {
    return (
      localStorage.getItem(
        `taylor-arrow-text-two-${this.props.direction}${this.props.row}${this.props.column}`,
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
    const { direction, text, text2, type } = this.state;
    this.props.onArrowChange(direction, text, text2, type);
  }

  setLocalStorageActive(value) {
    localStorage.setItem(
      `taylor-arrow-active-${this.props.direction}${this.state.row}${this.state.column}`,
      value,
    );
  }

  deactivateArrow() {
    this.setState(
      {
        isActive: false,
      },
      () => this.props.onArrowDelete(this.state.direction),
    );
    this.setLocalStorageActive(false);
  }

  handleTextChange(event) {
    const text = event.target.value;
    this.setState(
      {
        text,
      },
      () => this.updateStateInParent(),
    );
    this.setLocalStorageText(text);
  }

  setLocalStorageText(value) {
    localStorage.setItem(
      `taylor-arrow-text-${this.props.direction}${this.state.row}${this.state.column}`,
      value,
    );
  }

  handleTextTwoChange(event) {
    const text2 = event.target.value;
    this.setState(
      {
        text2: event.target.value,
      },
      () => this.updateStateInParent(),
    );
    this.setLocalStorageTextTwo(text2);
  }

  setLocalStorageTextTwo(value) {
    localStorage.setItem(
      `taylor-arrow-text-two-${this.props.direction}${this.state.row}${this.state.column}`,
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
      `taylor-arrow-type-${this.props.direction}${this.state.row}${this.state.column}`,
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
    return (
      <div>
        <button onClick={this.handleArrowClick} className={className}>
          {this.state.direction}
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
            <div className="modal-text">
              <label htmlFor="arrow-text"> Arrow text: </label>
              <input
                type="text"
                id="arrow-text"
                value={this.state.text}
                onChange={this.handleTextChange}
              />
              <label htmlFor="arrow-text2"> Arrow text 2: </label>
              <input
                type="text"
                id="arrow-text2"
                value={this.state.text2}
                onChange={this.handleTextTwoChange}
              />
            </div>
            <div className="modal-types">
              <label>Arrow types: </label>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="To"
                  id="To"
                  checked={this.state.type === 'To'}
                />
                <label htmlFor="To">To</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Mapsto"
                  id="Mapsto"
                  checked={this.state.type === 'Mapsto'}
                />
                <label htmlFor="Mapsto">Mapsto</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Line"
                  id="Line"
                  checked={this.state.type === 'Line'}
                />
                <label htmlFor="Line">Line</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Into"
                  id="Into"
                  checked={this.state.type === 'Into'}
                />
                <label htmlFor="Into">Into</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Onto"
                  id="Onto"
                  checked={this.state.type === 'Onto'}
                />
                <label htmlFor="Onto">Onto</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Dotsto"
                  id="Dotsto"
                  checked={this.state.type === 'Dotsto'}
                />
                <label htmlFor="Dotsto">Dotsto</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Dashto"
                  id="Dashto"
                  checked={this.state.type === 'Dashto'}
                />
                <label htmlFor="Dashto">Dashto</label>
              </div>
              <div>
                <input
                  onChange={this.handleTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Implies"
                  id="Implies"
                  checked={this.state.type === 'Implies'}
                />
                <label htmlFor="Implies">Implies</label>
              </div>
            </div>
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
