import React from 'react';
import Modal from 'react-modal';
import closeIcon from './window-close.svg';
import deleteIcon from './delete.svg';
 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
class Arrow extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      row: props.row,
      column: props.column,
      modalIsOpen: false,
      arrowDirection: props.arrowDirection,
      arrowActivated: this.getInitialArrowActivated(),
      arrowText: this.getInitialArrowText(),
      arrowText2: this.getInitialArrowTextTwo(),
      arrowType: this.getIntialArrowType(),
    };
 
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.passNewStateToProps = this.passNewStateToProps.bind(this);
  }
  
  getInitialArrowActivated() {
    let active = localStorage.getItem("taylor-arrow-activated-" + this.props.arrowDirection + this.props.row + this.props.column) || false;
    return active;
  }

  getInitialArrowText() {
    let text = localStorage.getItem("taylor-arrow-text-" + this.props.arrowDirection  + this.props.row + this.props.column) || "";
    return text;
  }

  getInitialArrowTextTwo() {
    let text = localStorage.getItem("taylor-arrow-text-two-" + this.props.arrowDirection  + this.props.row + this.props.column) || "";
    return text;
  }

  getIntialArrowType() {
    let type= localStorage.getItem("taylor-arrow-type-" + this.props.arrowDirection  + this.props.row + this.props.column) || "To";
    return type;
  }
 
  openModal() {
    if (this.state.arrowActivated) {
      this.setState({
        modalIsOpen: true
      });
    }
    else {
      this.setState({
        arrowActivated: true,
      }, () => this.passNewStateToProps());
      localStorage.setItem("taylor-arrow-activated-" + this.props.arrowDirection  + this.state.row + this.state.column, true);
    }
  }

  passNewStateToProps() {
    let direction = this.state.arrowDirection;
    let text = this.state.arrowText;
    let text2 = this.state.arrowText2;
    let type = this.state.arrowType;
    this.props.arrowActivated(direction, text, text2, type);
  }
 
  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  arrowTextChanged(event) {
    this.setState({
      arrowText: event.target.value
    }, () => this.passNewStateToProps());
    localStorage.setItem("taylor-arrow-text-" + this.props.arrowDirection  + this.state.row + this.state.column, event.target.value);
  }

  arrowTextTwoChanged(event) {
    this.setState({
      arrowText2: event.target.value
    }, () => this.passNewStateToProps());
    localStorage.setItem("taylor-arrow-text-two-" + this.props.arrowDirection  + this.state.row + this.state.column, event.target.value);
  }

  deleteArrow() {
    this.setState({
      arrowActivated: false,
      modalIsOpen: false
    }, () => this.props.arrowDeleted(this.state.arrowDirection)); 
    localStorage.setItem("taylor-arrow-activated-" + this.props.arrowDirection  + this.state.row + this.state.column, false);
  }

  onArrowTypeChange(event) {
    this.setState({
      arrowType: event.target.value
    }, () => this.passNewStateToProps());
    localStorage.setItem("taylor-arrow-type-" + this.props.arrowDirection  + this.state.row + this.state.column, event.target.value);
  }
 
  render() {
    let className = "";
    if (this.state.arrowActivated) {
      className = "arrow-activated";
    }
    return (
      <div>
        <button onClick={this.openModal} className={className}
        >{this.state.arrowDirection}</button>
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
              <button title="Delete arrow" className="modal-button-close" type="button" onClick={this.deleteArrow.bind(this)}><img src={deleteIcon} alt="delete-arrow"/></button>
              <button title="Close modal" className="modal-button-close" type="button" onClick={this.closeModal}><img src={closeIcon} alt="close-modal"/></button>
            </div>
          </div>
          <form className="modal-container">
            <div className="modal-text">
              <label  htmlFor="arrow-text"> Arrow text: </label>
              <input type="text" id="arrow-text" 
              value={this.state.arrowText} 
              onChange={this.arrowTextChanged.bind(this)} />
              <label  htmlFor="arrow-text2"> Arrow text 2: </label>
              <input type="text" id="arrow-text2" 
              value={this.state.arrowText2} 
              onChange={this.arrowTextTwoChanged.bind(this)} />
            </div>
            <div className="modal-types">
                <label>Arrow types: </label>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="To" id="To"
                  checked={this.state.arrowType === "To"}/> 
                  <label htmlFor ="To">To</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Mapsto"  id="Mapsto"
                  checked={this.state.arrowType === "Mapsto"} /> 
                  <label htmlFor ="Mapsto">Mapsto</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Line" id="Line"
                    checked={this.state.arrowType === "Line"}/> 
                  <label htmlFor ="Line">Line</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Into" id="Into"
                  checked={this.state.arrowType === "Into"} />
                  <label htmlFor ="Into">Into</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Onto" id="Onto"
                  checked={this.state.arrowType === "Onto"}/> 
                  <label htmlFor ="Onto">Onto</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Dotsto" id="Dotsto"
                  checked={this.state.arrowType === "Dotsto"}/> 
                  <label htmlFor ="Dotsto">Dotsto</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Dashto" id="Dashto"
                  checked={this.state.arrowType === "Dashto"}/> 
                  <label htmlFor ="Dashto">Dashto</label>
                </div>
                <div>
                  <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Implies" id="Implies"
                  checked={this.state.arrowType === "Implies"}/> 
                  <label htmlFor ="Implies">Implies</label>
                </div>
              </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default Arrow;