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

class CellSelectView extends Component {
    constructor(props) {
      super()
      this.state = {
        oldCell: -1, 
        items
      }
    }

    handleInputChange = (event) => {
      const value = event.target.value;
      const items = this.state.items;
      const item = items[value];
      if (this.state.oldCell !== -1){
        items[this.state.oldCell].boolName = false
      }
      items[value].boolName = true
      this.setState({items, oldCell: value})
      this.props.showCell(item)
    }

    // componentWillReceiveProps(nextProps){
    //   this.clearTable()
    // }
    
    clearTable = () => {
      const items = this.state.items
      if (this.props.showFormBool === false || this.props.edits){
        for (var i in items){
          if (items[i].boolName){
            items[i].boolName = false
            this.setState({items})
            break;
          }
        }
      }
    }

    render() {
      return (
        <div className="outerContainer">
          <h2>Select a Content Block</h2>
          <table className="leftContainer1">
            <tbody>
              { [this.renderTableRows()] }
            </tbody>
          </table>
        </div>
      )
    }


    renderTableRows = () => {
      if (!this.state.items) return <tr key={0}><td></td><td>Loading...</td></tr>
      return this.state.items.map((item, i) => {    
        return <tr key={i}> 
          { (item.header) ? <td><p>{item.type}</p></td> : <td><button className={'attendee-selector__name' + ((item.boolName===true) ? '--gray' : '')} value={i} onClick={this.handleInputChange}>{item.type}</button></td>     }
        </tr>
      })
    }
  }


const items = [
  {
    header: true,
    type: "LANDING PAGE"
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Video",
    boolName: false,
    videoBool: true,
    boldBool: false
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Video & Bold Header",
    boolName: false,
    videoBool: true,
    boldBool: true
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Image",
    boolName: false,
    imageBool: true,
    boldBool: false
  },
  {
    name: "Landing Page Cell",
    type: "Landing Page with Image & Bold Header",
    boolName: false,
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

export default CellSelectView