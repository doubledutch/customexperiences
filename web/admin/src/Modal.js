import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import 'moment-timezone';
import moment from 'moment'
import DateTimePicker from "@doubledutch/react-components/lib/DateTimePicker"

export class CustomModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      currentTime: new Date(),
      disabled: false
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.publishDate !== nextProps.publishDate){
      this.setState({currentTime: nextProps.publishDate})
    }
    if (this.props.showModal !== nextProps.showModal) {
      this.setState({disabled: false})
    }
  }

  render() {
    return(
      <Modal
        ariaHideApp={false}
        isOpen={this.props.showModal}
        onAfterOpen={this.props.afterOpenModal}
        onRequestClose={this.props.closeModal}
        contentLabel="Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modalBox">
          <span className="submitBox2">
              <label className="boxTitle">
                Name your template:
                <input className={(this.state.error) ? "eventNameRed" : "eventName"} name="currentEdit" maxLength="50" type="value" value={this.props.currentEdit} onChange={this.handleChange}/>
                <p className={(this.state.error ? "errorTitleRed" : "errorTitle")}>*Please rename your template</p>
              </label>
          </span>
          <div className="modalTextBox">
            <DateTimePicker value={this.state.currentTime} onChange={this.handleNewDate} timeZone={this.props.eventData.timeZone}/>
          </div>
          <div className="modalButtonBox">
            {this.modalButtons()}
          </div >    
        </div>
      </Modal>
    )
  }

  handleChange = (event) => {
    if (this.state.error) {
      this.setState({error: false})
    }
    this.props.handleChange(event)
  }

  handleNewDate = (date) => {
    this.setState({currentTime: date});
  }


  modalButtons = () => {
    return (
      <div>
        <button className="modalDone" onClick={this.cancelClose}>Cancel</button>
        <button className="modalExport" disabled={this.state.disabled} onClick={this.publish(this.state.currentTime)}>Publish Content</button> 
      </div>
    )
  }

  cancelClose = () => {
    this.setState({error: false})
    this.props.closeModal()
  }

  publish = time => () => {
    const currentEdit = this.props.currentEdit.trim()
    var currentTemplate = this.props.templates.find(item => item.key.toLowerCase() === currentEdit.toLowerCase())
    if (currentTemplate) {currentTemplate = currentTemplate.key.toLowerCase()}
    if (!currentTemplate) {currentTemplate = false}
    currentTemplate = ((currentTemplate === this.props.currentTitle.toLowerCase()) ?  false : currentTemplate)
    if (currentEdit && !currentTemplate && this.checker()){
      this.props.saveLocalHour(time)
      this.props.publish(time, currentEdit)
      this.setState({error: false, disabled: true})
    }
    else {
      this.setState({error: true, disabled: false})
    }
  }
checker = () => {
  if (!/[~`!#$%\^*+=\\[\]\\';./{}|\\"<>\?]/g.test(this.props.currentEdit)) {
    return true
  }
  else return false
}

}

export default CustomModal