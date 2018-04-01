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
      modalIsOpen: false,
      arrowType: props.arrowType,
      arrowText: ""
    };
 
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
 
  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  arrowTextChanged(event) {
    this.setState({
      arrowText: event.target.value
    });
  }
 
  render() {
    return (
      <div>
        <button onClick={this.openModal}>{this.state.arrowType}</button>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Arrow modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Edit arrow properties</h2>
          <button onClick={this.closeModal}>close</button>
          <form>
            <label  htmlFor="arrow-text"> Arrow text: </label>
            <input type="text" id="arrow-text" 
            value={this.state.arrowText} 
            onChange={this.arrowTextChanged.bind(this)} />
            <button>delete arrow</button>
          </form>
        </Modal>
      </div>
    );
  }
}
export default Arrow;