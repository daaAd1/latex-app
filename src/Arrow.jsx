import React from 'react';
import Modal from 'react-modal';
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
      modalIsOpen: false,
      arrowDirection: props.arrowDirection,
      arrowActive: this.getInitialArrowActive(),
      arrowText: this.getInitialArrowText(),
      arrowText2: this.getInitialArrowTextTwo(),
      arrowType: this.getIntialArrowType(),
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.passNewStateToProps = this.passNewStateToProps.bind(this);
    this.deleteArrow = this.deleteArrow.bind(this);
    this.arrowTextChanged = this.arrowTextChanged.bind(this);
    this.arrowTextTwoChanged = this.arrowTextTwoChanged.bind(this);
    this.getInitialArrowActive = this.getInitialArrowActive.bind(this);
    this.getInitialArrowText = this.getInitialArrowText.bind(this);
    this.getInitialArrowTextTwo = this.getInitialArrowTextTwo.bind(this);
    this.getIntialArrowType = this.getIntialArrowType.bind(this);
    this.onArrowTypeChange = this.onArrowTypeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.arrowActive !== this.state.arrowActive) {
      this.setState({
        arrowActive: nextProps.arrowActive,
      });
    }
    if (nextProps.arrowText !== this.state.arrowText) {
      this.setState({
        arrowText: nextProps.arrowText,
      });
    }
    if (nextProps.arrowText2 !== this.state.arrowText2) {
      this.setState({
        arrowText2: nextProps.arrowText2,
      });
    }
  }

  onArrowTypeChange(event) {
    this.setState(
      {
        arrowType: event.target.value,
      },
      () => this.passNewStateToProps(),
    );
    localStorage.setItem(
      `taylor-arrow-type-${this.props.arrowDirection}${this.state.row}${this.state.column}`,
      event.target.value,
    );
  }

  getInitialArrowActive() {
    let active =
      localStorage.getItem(
        `taylor-arrow-activated-${this.props.arrowDirection}${this.props.row}${this.props.column}`,
      ) || false;
    if (active === 'true') {
      active = true;
    } else {
      active = false;
    }
    return active;
  }

  getInitialArrowText() {
    const text =
      localStorage.getItem(
        `taylor-arrow-text-${this.props.arrowDirection}${this.props.row}${this.props.column}`,
      ) || '';
    return text;
  }

  getInitialArrowTextTwo() {
    const text =
      localStorage.getItem(
        `taylor-arrow-text-two-${this.props.arrowDirection}${this.props.row}${this.props.column}`,
      ) || '';
    return text;
  }

  getIntialArrowType() {
    const type =
      localStorage.getItem(
        `taylor-arrow-type-${this.props.arrowDirection}${this.props.row}${this.props.column}`,
      ) || 'To';
    return type;
  }

  openModal() {
    if (this.state.arrowActive) {
      this.setState({
        modalIsOpen: true,
      });
    } else {
      this.setState(
        {
          arrowActive: true,
        },
        () => this.passNewStateToProps(),
      );
      localStorage.setItem(
        `taylor-arrow-activated-${this.props.arrowDirection}${this.state.row}${this.state.column}`,
        true,
      );
    }
  }

  passNewStateToProps() {
    const direction = this.state.arrowDirection;
    const text = this.state.arrowText;
    const text2 = this.state.arrowText2;
    const type = this.state.arrowType;
    this.props.arrowActivated(direction, text, text2, type);
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  arrowTextChanged(event) {
    this.setState(
      {
        arrowText: event.target.value,
      },
      () => this.passNewStateToProps(),
    );
    localStorage.setItem(
      `taylor-arrow-text-${this.props.arrowDirection}${this.state.row}${this.state.column}`,
      event.target.value,
    );
  }

  arrowTextTwoChanged(event) {
    this.setState(
      {
        arrowText2: event.target.value,
      },
      () => this.passNewStateToProps(),
    );
    localStorage.setItem(
      `taylor-arrow-text-two-${this.props.arrowDirection}${this.state.row}${this.state.column}`,
      event.target.value,
    );
  }

  deleteArrow() {
    this.setState(
      {
        arrowActive: false,
        modalIsOpen: false,
      },
      () => this.props.arrowDeleted(this.state.arrowDirection),
    );
    localStorage.setItem(
      `taylor-arrow-activated-${this.props.arrowDirection}${this.state.row}${this.state.column}`,
      false,
    );
  }

  render() {
    let className = '';
    if (this.state.arrowActive) {
      className = 'arrow-activated';
    }
    return (
      <div>
        <button onClick={this.openModal} className={className}>
          {this.state.arrowDirection}
        </button>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
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
                value={this.state.arrowText}
                onChange={this.arrowTextChanged}
              />
              <label htmlFor="arrow-text2"> Arrow text 2: </label>
              <input
                type="text"
                id="arrow-text2"
                value={this.state.arrowText2}
                onChange={this.arrowTextTwoChanged}
              />
            </div>
            <div className="modal-types">
              <label>Arrow types: </label>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="To"
                  id="To"
                  checked={this.state.arrowType === 'To'}
                />
                <label htmlFor="To">To</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Mapsto"
                  id="Mapsto"
                  checked={this.state.arrowType === 'Mapsto'}
                />
                <label htmlFor="Mapsto">Mapsto</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Line"
                  id="Line"
                  checked={this.state.arrowType === 'Line'}
                />
                <label htmlFor="Line">Line</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Into"
                  id="Into"
                  checked={this.state.arrowType === 'Into'}
                />
                <label htmlFor="Into">Into</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Onto"
                  id="Onto"
                  checked={this.state.arrowType === 'Onto'}
                />
                <label htmlFor="Onto">Onto</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Dotsto"
                  id="Dotsto"
                  checked={this.state.arrowType === 'Dotsto'}
                />
                <label htmlFor="Dotsto">Dotsto</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Dashto"
                  id="Dashto"
                  checked={this.state.arrowType === 'Dashto'}
                />
                <label htmlFor="Dashto">Dashto</label>
              </div>
              <div>
                <input
                  onChange={this.onArrowTypeChange}
                  type="radio"
                  name="arrow-type"
                  value="Implies"
                  id="Implies"
                  checked={this.state.arrowType === 'Implies'}
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

export default Arrow;
