import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import 'moment-timezone';
import moment from 'moment' 

export class CustomModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      currentTime: new Date()
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.publishDate !== nextProps.publishDate){
      this.saveHour(nextProps.publishDate)
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
            {this.showCalendar()}
          </div>
          {this.selectHour()}
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

  selectHour = () => {
    return (
      <div className="hourBox">
        <p className="hourDropdownTitle">Select Release Time: </p>
        <div className="releaseTimeBox">
          <form className="dropdownMenu" onChange={this.setHour}>
            <select className="dropdownText" value={this.state.currentTime.getHours()} name="hours">
              <option value="0">12am</option>
              <option value="1">1am</option>
              <option value="2">2am</option>
              <option value="3">3am</option>
              <option value="4">4am</option>
              <option value="5">5am</option>
              <option value="6">6am</option>
              <option value="7">7am</option>
              <option value="8">8am</option>
              <option value="9">9am</option>
              <option value="10">10am</option>
              <option value="11">11am</option>
              <option value="12">12pm</option>
              <option value="13">1pm</option>
              <option value="14">2pm</option>
              <option value="15">3pm</option>
              <option value="16">4pm</option>
              <option value="17">5pm</option>
              <option value="18">6pm</option>
              <option value="19">7pm</option>
              <option value="20">8pm</option>
              <option value="21">9pm</option>
              <option value="22">10pm</option>
              <option value="23">11pm</option>
            </select>
          </form>
          <p>{this.props.eventData.timeZone ? this.props.eventData.timeZone : null}</p>
        </div>
      </div>
    )
  }

  saveHour = (publishDate) => {
    var publishDate = publishDate
    if (this.props.eventData.timeZone) {
      var hourOffset = moment.tz(this.props.eventData.timeZone).format("Z")
      hourOffset = parseInt(hourOffset)
      const currentHour = publishDate.getHours()
      publishDate.setHours(currentHour + hourOffset)
      publishDate.setMinutes(0)
      publishDate.setSeconds(0)
    }
    this.setState({currentTime: publishDate})
  }

  setHour = (event) => {
    var hour = event.target.value
    var currentTime = this.state.currentTime
    currentTime.setHours(hour)
    currentTime.setMinutes(0)
    currentTime.setSeconds(0)
    this.setState({currentTime});
  }

  
  showCalendar = () => {
    var today = this.state.currentTime
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
    return (
      <label className="boxTitle">
        Select a Publish Date:
        <div className="calendarBox">
        <InfiniteCalendar
          width={300}
          height={240}
          selected={today}
          minDate = {lastWeek}
          displayOptions={{
            showHeader: false
          }}
          name="publishDate"
          onSelect={this.handleDate}
        />
        </div>
      </label>
    )
  }

  handleDate = (date) => {
    var publishDate = date
    var hourOffset = moment.tz(this.props.eventData.timeZone).format("Z")
    const currentHour = publishDate.getHours()
    hourOffset = parseInt(hourOffset)
    hourOffset = hourOffset * -1
    publishDate.setHours(currentHour + hourOffset)
    this.setState({currentTime: publishDate});
  }


  modalButtons = () => {
    return (
      <div>
        <button className="modalDone" onClick={this.cancelClose}>Cancel</button>
        <button className="modalExport" onClick={this.publish(this.state.currentTime)}>Publish Content</button> 
      </div>
    )
  }

  cancelClose = () => {
    this.setState({error: false})
    this.props.closeModal()
  }

  publish = content => () => {
    const currentEdit = this.props.currentEdit.trim()
    var currentTemplate = this.props.templates.find(item => item.key.toLowerCase() === currentEdit.toLowerCase())
    if (currentTemplate) {currentTemplate = currentTemplate.key.toLowerCase()}
    if (!currentTemplate) {currentTemplate = false}
    currentTemplate = ((currentTemplate === this.props.currentTitle.toLowerCase()) ?  false : currentTemplate)
    if (currentEdit && !currentTemplate && this.checker()){
      this.props.publish(content, currentEdit)
      this.setState({error: false})
    }
    else {
      this.setState({error: true})
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