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
import FirebaseConnector from '@doubledutch/firebase-connector'
import 'moment-timezone';
import moment from 'moment' 
import CellSelectView from './CellSelect.js'
import FormView from './FormView.js'
import AppView from './AppView.js'
import CustomModal from './Modal.js'
import ContentPreview from './ContentPreview.js'
import "@doubledutch/react-components/lib/base.css"
const fbc = FirebaseConnector(client, 'customexperiences')
fbc.initializeAppWithSimpleBackend()

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
      publishDate: new Date(),
      formItems,
      eventData: {}
    }

    // Showing the builder UI is not a security issue.
    // Just hiding it to reduce confusion when we know the user is non-DD.
    client.cmsRequest('GET', '/api/Principal').then(user => {
      const shouldShow = !!user.Permissions.find(p => p.Verb === 'Update' && p.Resource === 'DoubleDutchInternalSetting')
      this.setState({shouldShow})
    }).catch(() => this.setState({shouldShow: true}))

    this.signin = fbc.signinAdmin()
    .then(user => this.user = user)
    .catch(err => console.error(err))

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
    if (!this.state.edits) this.clearTable()
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
    this.signin.then((user) => {
      client.getCurrentEvent().then(evt => {
        this.setState({eventData: evt})
        const templateRef = fbc.database.public.adminRef('templates')
        templateRef.on('child_added', data => {
          let template = this.saveHour(data.val())
          this.setState({ templates: [...this.state.templates, {...template, key: data.key }] })   
        })
        templateRef.on('child_changed', data => {
          const name = data.key
          const template = data.val()
          var newArray = this.state.templates
          var i = newArray.findIndex(item => {
            return item.key === name
          })
          newArray.splice(i, 1)
          this.setState({ templates: [...this.state.templates, {...template, key: data.key }] })  
        })
        templateRef.on('child_removed', data => {
          this.setState({ templates: this.state.templates.filter(x => x.key !== data.key), items: [] })
        })
      })
    })
  }

  saveHour = (template) => {
    let currentTemplate = template
    let publishDate = new Date(template[0].publishDate)
    let newDateObj = {publishDate: publishDate.getTime()}
    currentTemplate[0] = newDateObj
    return currentTemplate
  }

  newItem = () => {
    const newArray = this.state.items.concat(this.state.newCell)
    this.setState({items: newArray, showFormBool: false, newCell: ''})
    this.clearTable()
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

  submitTemplate = () => {
    fbc.database.public.adminRef('templates').child(this.state.value).set(this.state.items)
  }

  submitEventData = (origDate) => {
    var publishTime = [{publishDate: origDate.getTime()}]
    var items = this.state.items
    var title = this.state.value
    if (title) {title = this.state.value.toLowerCase()}
    title = ((title === this.state.currentEdit.toLowerCase())? this.state.value : this.state.currentEdit)
    if (items.length) {
      if (items[0].pendingDate){
        items.shift()
      }
      var newItems = publishTime.concat(items)
      this.setState({value : title})
      fbc.database.public.adminRef('templates').child(title).set(newItems).then(() => {
        this.closeModal()
      })
    }
  }

  saveLocalHour = (origDate) => {
    this.setState({publishDate: new Date(origDate)})
  }

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false, currentEdit: this.state.value})
  }

  deleteTemplate = (e) => {
    if (window.confirm("Are you sure you want to delete the template?")) {
      fbc.database.public.adminRef("templates").child(this.state.value).remove()
      this.setState({value: "", currentEdit: ""})
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
    var newCell = Object.assign({}, this.state.newCell)
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
    var newCell = Object.assign({}, this.state.newCell)
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
        <ContentPreview content={this.state.newCell} formBools = {this.state.formBools}/>
      </div>
    )
  }


  handleForm = (formItems) => {
    this.setState({formItems})
  }

  clearTable = () => {
    const items = this.state.formItems
    const index = items.findIndex((item) => item.boolName)
    items[index].boolName = false
    this.setState({formItems: items})
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
          templates={this.state.templates}
          eventData={this.state.eventData}
          saveLocalHour={this.saveLocalHour}
        />
        <h2>Select a Template (optional)</h2>
        <div className="submitBox">
          <form className="dropdownMenu">
            <select className="dropdownText" value={this.state.value} name="session" onChange={this.loadTemplate}>
              <option className="dropdownTitle" value="">{'\xa0\xa0'}View Templates</option>
              { allTemplates.map((task, i) => {
                var title = task.key
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
            handleForm = {this.handleForm}
            items={this.state.formItems}
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
          { this.state.showFormBool ? this.showPreview() :
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

const formItems = [
  {
    header: true,
    type: "LANDING PAGE"
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Video",
    boolName: false,
    videoBool: true,
    boldBool: false,
    imageBool: false
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Video & Bold Header",
    boolName: false,
    videoBool: true,
    boldBool: true,
    imageBool: false
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Image",
    boolName: false,
    videoBool: false,
    imageBool: true,
    boldBool: false
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Image & Bold Header",
    boolName: false,
    videoBool: false,
    imageBool: true,
    boldBool: true
  },
  {
    header: true,
    type: "OFFER CELLS"
  },
  {
    name: "Details Cell",
    type: "Rectangle with Icon & Text", 
    boolName: false,
  },
  { 
    name: "Dual Details Cell", 
    type: "Dual Cell Rectangles with Icon & Text Rectangle", 
    boolName: false,
  },
  {
    header: true,
    type: "CAROUSEL CELLS"
  },
  {
    name: "Speaker Highlight Cell",
    type: "Speaker Biography Page w/ Profile Picture",
    boolName: false,
  },
  {
    name: "Image Carousel",
    type: "Full Width Images Only", 
    boolName: false,
  },
  {
    header: true,
    type: "IMAGE CELLS"
  },
  {
    name: "Image Cell",
    type: "1 Full Width Square Image",
    boolName: false,
  },
  {
    name: "Dual Images Cell",
    type: "Dual Rectangles of Full Width Images only",
    boolName: false,
  },
  {
    name: "Squares Cell",
    type: "4 Squares of Images only (2 per line)",
    boolName: false,
  },
  {
    header: true,
    type: "TEXT CELLS"
  },
  {
    name: "Text Squares Cell",
    type: "4 Squares of Image & Text (2 per line)",
    boolName: false,
  },
  {
    name: "Text Cell",
    type: "Text Only Square",
    boolName: false,
  },
  {
    header: true,
    type: "BUTTON CELLS"
  },
  {
    name: "Footer Cell",
    type: "Dual Buttons Footer",
    boolName: false,
  },
]

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
