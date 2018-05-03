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
import ContentPreview from './ContentPreview.js'

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
      currentEdit: '',
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

  showCell = (object) => {
    const origData = this.state.cellData.find(item => item.type === object.name)
    var newCell = JSON.parse(JSON.stringify(origData)) // Quick and dirty deep copy
    if (newCell.type === "Landing Page Cell") {newCell.bold = object.boldBool}
    this.setState({showFormBool: true, newCell, edits: false, formBools: object})
  }

  handleSubmit = (event) => {
    const current = this.state.newCell
    if (current.video) {
      if (!current.video.match(/^(https?\:\/\/)(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
        alert('Video URL must be a youtube URL.')
      }
    }
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

  closeForm = () => {
    this.setState({showFormBool: false, newCell: ''})
  }

  handleDelete = (event) => {
    if (window.confirm("Are you sure you want to delete the cell?")) {
      var items = this.state.items
      var item = event.target.name
      items.splice(item, 1)
      this.setState({items, newCell: '', showFormBool: false});  
    }
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
    this.setState({items: newArray, showFormBool: false, newCell: ''})
  }

  editItem = () => {
    const i = this.state.editCell
    var newArray = this.state.items
    newArray[i] = this.state.newCell
    this.setState({items: newArray, showFormBool: false, edits: false, newCell: ''})
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
    var newCell = Object.assign({}, testCell)
    this.setState({ newCell });
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  setKey = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  setHour = (event) => {
    var hour = event.target.value
    var date = this.state.publishDate
    date.setHours(+hour)
    date.setMinutes(0)
    date.setSeconds(0)
    this.setState({publishDate: date});
  }

  handleDate = (date) => {
    this.setState({publishDate: date});
  }

  submitTemplate = () => {
    fbc.database.public.adminRef('templates').child(this.state.value).set(this.state.items)
  }

  submitEventData = (publishDate) => {
    var publishTime = [{publishDate: publishDate.getTime()}]
    var items = this.state.items
    var title = this.state.value
    if (title) {title = this.state.value.toLowerCase()}
    title = ((title === this.state.currentEdit.toLowerCase())? this.state.value : this.state.currentEdit)
    if (items.length) {
      if (items[0].pendingDate){
        items.shift()
      }
      var newItems = publishTime.concat(items)
      this.setState({publishDate, value : title})
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
      this.setState({value: ""})
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

  deleteLastSpeaker = () => {
    var newCell = this.state.newCell
    if (newCell.speakerInfo.length > 1) {
      newCell.speakerInfo.pop()
      this.setState({newCell})
    }
  }

  handleNewImage = () => {
    const newImage =  [{
      image: '',
      URL: ''
    }]
    var newCell = this.state.newCell
    newCell.imageInfo = newCell.imageInfo.concat(newImage)
    this.setState({newCell})
  }

  deleteLastImage = () => {
    var newCell = this.state.newCell
    if (newCell.imageInfo.length > 1) {
      newCell.imageInfo.pop()
      this.setState({newCell})
    }
  }

  loadTemplate = (event) => {
    var items = []
    var title = event.target.value || ''
    var publishDate = new Date()
    var item = this.state.templates.find(item => {
      return item.key === title
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
    this.setState({items, value: title, currentEdit: title, publishDate, newCell:'', showFormBool: false});
  }

  showPreview = () => {
    return (
      <div>
        <h2 style={{marginBottom: "50px"}}>Preview</h2>
        <ContentPreview content={this.state.newCell}/>
      </div>
    )
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
        currentTitle = {this.state.value}
        currentEdit = {this.state.currentEdit}
        handleChange = {this.handleChange}
        handleDate = {this.handleDate}
        setHour={this.setHour}
        templates={this.state.templates}
        />
        <h2>Select a Template (optional)</h2>
        <div className="submitBox">
          <form className="dropdownMenu">
            <select className="dropdownText" value={this.state.value} name="session" onChange={this.loadTemplate}>
              <option className="dropdownTitle" value="">{'\xa0\xa0'}View Templates</option>
              { allTemplates.map((task, i) => {
                var title = task.key
                var data = task
                return (
                <option className="dropdownTitle" key={i} value={task.key}>{'\xa0\xa0' + title}</option>  
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
          newCell = {this.state.newCell}
          />
          <FormView
          showFormBool = {this.state.showFormBool}
          newCell = {this.state.newCell}
          formBools = {this.state.formBools}
          handleSubmit = {this.handleSubmit}
          handleNewSpeaker={this.handleNewSpeaker}
          deleteLastSpeaker={this.deleteLastSpeaker}
          deleteLastImage={this.deleteLastImage}
          handleNewImage={this.handleNewImage}
          updateCell = {this.updateCell}
          edits = {this.state.edits}
          cellData={this.state.cellData}
          closeForm={this.closeForm}
          />
          {this.state.showFormBool ? this.showPreview() :
          <AppView
          items = {this.state.items}
          onDragEnd = {this.onDragEnd}
          handleDelete = {this.handleDelete}
          handleEdit = {this.handleEdit}
          showFormBool = {this.state.showFormBool}
          newCell={this.state.newCell}
          /> }
        </div>
        <div className="buttonsContainer">
          <button className="modalButton" style={{marginRight: 10, fontSize: 18}} onClick={this.openModal} disabled={(!this.state.items.length || this.state.showFormBool)} value="false">Publish to App</button>
          <button className="modalButton" style={{marginRight: 40, fontSize: 18, backgroundColor: "red"}} disabled={(!this.state.value || this.state.showFormBool)} onClick={this.deleteTemplate} value="false">Delete & Unpublish</button>
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
    intro: '',
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
    intro: '',
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
    intro: "",
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
    intro: '',
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    imageInfo: [
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
    intro: '',
    title: "",
    des: "",
    buttonURL: '',
    buttonText: "",
    image1: '',
    title1: "",
    des1: "",
    url1: '',
    image2: '',
    title2: "",
    des2: "",
    url2: ''
  },
  {
    type: "Image Cell",
    header: false,
    footer: false,
    intro: '',
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
    intro: '',
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
    intro: '',
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
