import React from 'react';
import Modal from 'react-modal';
 
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
      arrowActivated: false,
      arrowText: "",
      arrowType: "To"
    };
 
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
 
  openModal() {
    if (this.state.arrowActivated) {
      this.setState({
        modalIsOpen: true
      });
    }
    else {
      this.setState({
        arrowActivated: true
      });
    }
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  arrowTextChanged(event) {
    this.setState({
      arrowText: event.target.value
    });
  }

  deleteArrow() {
    this.setState({
      arrowActivated: false,
      modalIsOpen: false
    });
  }

  onArrowTypeChange(event) {
    this.setState({
      arrowType: event.target.value
    });
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

          <h2 ref={subtitle => this.subtitle = subtitle}>Edit arrow properties</h2>
          <button type="button" onClick={this.closeModal}>close</button>
          <form>
            <label  htmlFor="arrow-text"> Arrow text: </label>
            <input type="text" id="arrow-text" 
            value={this.state.arrowText} 
            onChange={this.arrowTextChanged.bind(this)} />
            <button type="button" onClick={this.deleteArrow.bind(this)}>delete arrow</button>
              <div className="arrowButtons">
                 Arrow types: 
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="To" id="To"
                checked={this.state.arrowType === "To"}/> 
                <label htmlFor ="To">To</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Mapsto"  id="Mapsto"
                 checked={this.state.arrowType === "Mapsto"} /> 
                <label htmlFor ="Mapsto">Mapsto</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Line" id="Line"
                   checked={this.state.arrowType === "Line"}/> 
                <label htmlFor ="Line">Line</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Into" id="Into"
                 checked={this.state.arrowType === "Into"} />
                <label htmlFor ="Into">Into</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Onto" id="Onto"
                 checked={this.state.arrowType === "Onto"}/> 
                <label htmlFor ="Onto">Onto</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Dotsto" id="Dotsto"
                 checked={this.state.arrowType === "Dotsto"}/> 
                <label htmlFor ="Dotsto">Dotsto</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Dashto" id="Dashto"
                 checked={this.state.arrowType === "Dashto"}/> 
                <label htmlFor ="Dashto">Dashto</label>
                <input onChange={this.onArrowTypeChange.bind(this)} type="radio" name="arrow-type" value="Implies" id="Implies"
                 checked={this.state.arrowType === "Implies"}/> 
                <label htmlFor ="Implies">Implies</label>
              </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default Arrow;