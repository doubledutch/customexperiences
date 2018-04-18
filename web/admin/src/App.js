/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FirebaseConnector from '@doubledutch/firebase-connector'
import CellSelectView from './CellSelect.js'
import FormView from './FormView.js'
import AppView from './AppView.js'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Modal  from 'react-modal'
import CustomModal from './Modal.js'
const fbc = FirebaseConnector(client, 'customexperiences')
fbc.initializeAppWithSimpleBackend()
const { currentEvent, currentUser, primaryColor } = client
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shouldShow: null,
      value: '', 
      newCell: '',
      formBools: '',
      showFormBool: false,
      show: false,
      edits: false,
      editCell: 0,
      items: [],
      array: true,
      templates : [],
      cellData,
      showModal: false,
      publishDate: new Date()
    }

    // Showing the builder UI is not a security issue.
    // Just hiding it to reduce confusion when we know the user is non-DD.
    client.cmsRequest('GET', '/api/Principal').then(user => {
      const shouldShow = !!user.Permissions.find(p => p.Verb === 'Update' && p.Resource === 'DoubleDutchInternalSetting')
      this.setState({shouldShow})
    }).catch(() => this.setState({shouldShow: true}))

    this.signin = fbc.signinAdmin()
    .then(user => this.user = user)
    .catch(error => alert("Please try reloading page to connect to the database"))
  }

  showCell = (name, object) => {
    var origData = this.state.cellData.find(item => item.type === object.name)
    var newCell = Object.assign({}, origData)
    if (newCell.type === "Landing Page Cell") {newCell.bold = object.boldBool}
    this.setState({showFormBool: true, newCell, edits: false, formBools: object})
  }

  handleSubmit = (event) => {
    if (this.state.edits) {
      this.editItem()
    }
    else {
      this.newItem()
    }
  }

  handleEdit = (event) => {
    var item = event.target.name
    var newCell = Object.assign({}, this.state.items[item])
    this.setState({showFormBool: true, edits: true, newCell, editCell: item})
  }

  handleDelete = (event) => {
    var items = this.state.items
    var item = event.target.name
    items.splice(item, 1)
    this.setState({items});  
  }

  onDragEnd = (result) =>{
    var items = this.state.items
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    else {
      items = reorder(
        this.state.items,
        result.source.index,
        result.destination.index
      )
    }
    this.setState({
      items,
    });  
  
  }

  componentDidMount() {
    fbc.signinAdmin()
    .then(user => {
      const templateRef = fbc.database.public.adminRef('templates')
      templateRef.on('child_added', data => {
        var items = data.val()
        var publishDate = this.state.publishDate
        this.setState({ templates: [...this.state.templates, {...data.val(), key: data.key }] })   
      })
      templateRef.on('child_changed', data => {
        const name = data.key
        const newData = data.val()
        var newArray = this.state.templates
        var i = newArray.findIndex(item => {
          return item.key === name
        })
        newArray[i] = newData
        newArray[i].key = data.key
        this.setState({ templates: newArray})
      })
      templateRef.on('child_removed', data => {
        this.setState({ templates: this.state.templates.filter(x => x.key !== data.key), items: [] })
      })
    })
  }

  newItem = () => {
    const newArray = this.state.items.concat(this.state.newCell)
    this.setState({items: newArray, showFormBool: false})
  }

  editItem = () => {
    const i = this.state.editCell
    var newArray = this.state.items
    newArray[i] = this.state.newCell
    this.setState({items: newArray, showFormBool: false, edits: false})
  }

  removeItem = (name) => {
    var index = -1
    if (this.state.items){
      for (var i = 0; i < this.state.items.length; i += 1) {
        if(this.state.items[i]["type"] === name) {
            index = i;
        }
    }
  }

  this.state.items.splice(index, 1)
    if (index > -1) {
      this.setState({items: this.state.items, showFormBool: false})
    } 
  }

  updateCell = (testCell) => {
    this.setState({
      newCell : testCell
    });
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  setHour = (event) => {
    var hour = event.target.value
    var date = this.state.publishDate
    console.log(date)
    console.log(hour)
    console.log(date.getTimezoneOffset())
    if (hour < 25) {
      console.log("here")
      date.setHours(hour)
      date.setMinutes('00')
      date.setSeconds('00')
      this.setState({publishDate: date});
    }
  }

  handleDate = (date) => {
    this.setState({publishDate: date});
  }

  submitTemplate = () => {
    fbc.database.public.adminRef('templates').child(this.state.value).set(this.state.items)
  }

  submitEventData = (publishDate, title) => {
    var publishTime = [{publishDate: publishDate.getTime()}]
    var items = this.state.items
    if (items.length) {
      if (items[0].pendingDate){
        items.shift()
      }
      var newItems = publishTime.concat(items)
      this.setState({publishDate})
      fbc.database.public.adminRef('templates').child(title).set(newItems).then(() => {
        this.closeModal()
      })
    }
  }

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
    
  }

  deleteTemplate = (e) => {
    if (window.confirm("Are you sure you want to delete the template?")) {
      fbc.database.public.adminRef("templates").child(this.state.value).remove()
    } 
  }

  handleNewSpeaker = () => {
    const newSpeaker =  [{
      name: "",
      image: '',
      title: "",
      company: "",
      des: "",
      URL: '',
    }]
    var newCell = this.state.newCell
    newCell.speakerInfo = newCell.speakerInfo.concat(newSpeaker)
    this.setState({newCell})
  }

  loadTemplate = (event) => {
    var name = event.target.value
    var items = []
    var title = ''
      var publishDate = new Date().getTime()
      title = name
      var item = this.state.templates.find(item => {
        return item.key === name
      })
      for (var i in item){
        if (i !== "key") {
          if (item[i].publishDate) {
            publishDate = new Date(item[i].publishDate)
          }
          else {
            items = items.concat(item[i])
          }      
        }
      }
    this.setState({items, value: title, publishDate});
  }
  
 
  render() {
    const {shouldShow} = this.state
    if (shouldShow === null) return <div>Loading...</div>
    if (shouldShow === false) return <div>Please contact your customer experience manager about configuring custom experiences.</div>
    
    const allTemplates = this.state.templates

    return (
      <div className="App">
        <CustomModal
        showModal = {this.state.showModal}
        closeModal = {this.closeModal}
        publish={this.submitEventData}
        publishDate = {this.state.publishDate}
        title = {this.state.value}
        handleChange = {this.handleChange}
        handleDate = {this.handleDate}
        setHour={this.setHour}
        />
        <h2>Select a Template (optional)</h2>
        <div className="submitBox">
          <form className="dropdownMenu" onSubmit={this.handleSubmit}>
            <select className="dropdownText" value={this.state.session} name="session" onChange={this.loadTemplate}>
              <option style={{textAlign: "center"}} value="All">{'\xa0\xa0'}View Templates</option>
              { allTemplates.map((task, i) => {
                var title = task.key
                var data = task
                return (
                <option style={{textAlign: "center"}} key={i} value={task.key}>{'\xa0\xa0' + title}</option>  
                )      
              })
              }
            </select>
          </form> 
        </div>
        <div className="container">
          <CellSelectView
          showCell = {this.showCell}
          removeItem = {this.removeItem}
          hideForm = {this.hideForm}
          showFormBool = {this.state.showFormBool}
          edits = {this.state.edits}
          />
          <FormView
          showFormBool = {this.state.showFormBool}
          newCell = {this.state.newCell}
          formBools = {this.state.formBools}
          handleSubmit = {this.handleSubmit}
          handleNewSpeaker={this.handleNewSpeaker}
          updateCell = {this.updateCell}
          edits = {this.state.edits}
          />
          <AppView
          items = {this.state.items}
          onDragEnd = {this.onDragEnd}
          handleDelete = {this.handleDelete}
          handleEdit = {this.handleEdit}
          />
        </div>
        <div className="buttonsContainer">
          <button className="modalButton" style={{marginRight: 10, fontSize: 18}} onClick={this.openModal} value="false">Publish to App</button>
          <button className="modalButton" style={{marginRight: 40, fontSize: 18, backgroundColor: "red"}} onClick={this.deleteTemplate} value="false">Delete & Unpublish</button>
        </div>
        <div className="expoContainer"> 
          <h2>Preview Custom Experience</h2>
          <p>Copy & Paste the data below into the "dataInput" object to build your test app in Expo</p>
          <div className="printBox">
            <p>{JSON.stringify(this.state.items)}</p>
          </div>
        </div>
      </div>
    )
  }
}

const cellData = [
  {
    type: "Landing Page Cell",
    headline : "",
    title : "",
    intro: "",
    bold : false,
    footer: false,
    header: true,
    buttonURL : '',
    buttonText : "",
    des : "",
    video : "",
    image : ""
  },  
  {
    type: "Video Cell",
    header : false,
    footer: false,
    title : "",
    des : "",
    buttonURL : '',
    buttonText : "",
    video : ""
  },
  {
    type: "Text Squares Cell",
    header : false,
    footer: false,
    title : "",
    des : "",
    buttonURL : '',
    buttonText : "",
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    text1: '',
    text2: '',
    text3: '',
    text4: ''
  },
  {
    type: "Squares Cell",
    header : false,
    footer: false,
    title : "",
    des : "",
    buttonURL : '',
    buttonText : "",
    image1: '',
    image2: '',
    image3: '',
    image4: '',
  },
  {
    type: "Speaker Highlight Cell",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    speakerInfo: [
      {
        name: "",
        image: '',
        title: "",
        company: "",
        des: "",
        URL: '',
      }
    ]
  },
  {
    type: "Image Carousel",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    imageInfo: [
      {
        image: '',
        URL: '',
      },
      {
        image: '',
        URL: '',
      },
      {
        image: '',
        URL: '',
      }
    ]
  },
  {
    type: "",
    image: '',
    title: "",
    des: ""
  },
  {
    type: "Details Cell",
    title: "",
    description: "",
    image: ''
  },
  {
    type: "Dual Details Cell",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    image1: '',
    title1: "",
    des1: "",
    image2: '',
    title2: "",
    des2: ""
  },
  {
    type: "Dual Details Cell",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    image1: '',
    title1: "",
    des1: "",
    image2: '',
    title2: "",
    des2: ""
  },
  {
    type: "Image Cell",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    imageInfo:{
      image: '',
    }
  },
  {
    type: "Dual Images Cell",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    imageInfo: [
      {
        image: '',
      },
      {
        image: '',
      }
    ]
  },
  {
    type: "Text Cell",
    header: false,
    footer: false,
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    content: ""
  },
  {
    type: 'Footer Cell',
    buttons : [
      {
        buttonURL: '',
        buttonTitle: "",
      },
      {
        buttonURL: '',
        buttonTitle: "",
      }
    ]
  }
]
