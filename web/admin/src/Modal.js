import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

export class CustomModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false
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
              <input className={(this.state.error) ? "eventNameRed" : "eventName"} name="value" maxLength="250" type="value" value={this.props.title} onChange={this.props.handleChange}/>
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

  selectHour = () => {
    return (
      <div className="hourBox">
        <p className="hourDropdownTitle">Select Release Time: </p>
        <form className="dropdownMenu" onChange={this.props.setHour}>
          <select className="dropdownText" value={this.props.publishDate.getHours()} name="hours">
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
      </div>
    )
  }
  
  showCalendar = () => {
    console.log(this.props.publishDate)
    var today = this.props.publishDate
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return (
      <label className="boxTitle">
        Select a Publish Date:
        <div className="calendarBox">
        <InfiniteCalendar
          width={300}
          height={240}
          selected={today}
          minDate = {new Date(1980, 0, 1)}
          displayOptions={{
            showHeader: false
          }}
          name="publishDate"
          onSelect={this.props.handleDate}
        />
        </div>
      </label>
    )
  }


  modalButtons = () => {
    const c = this.props.selectedContent
    return (
      <div>
        <button className="modalDone" onClick={this.props.closeModal}>Cancel</button>
        <button className="modalExport" onClick={this.publish(this.props.publishDate)}>Publish Content</button> 
      </div>
    )
  }

  publish = content => () => {
    if (this.props.title){
      this.props.publish(content, this.props.title)
      this.setState({error: false})
    }
    else {
      this.setState({error: true})
    }
  }

}

export default CustomModal