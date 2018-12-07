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

class CellSelectView extends Component {
  constructor(props) {
    super()
    this.state = {
      oldCell: -1,
    }
  }

  handleInputChange = event => {
    const value = event.target.value
    const items = this.props.items
    const item = items[value]
    if (this.state.oldCell !== -1) {
      items[this.state.oldCell].boolName = false
    }
    items[value].boolName = true
    this.setState({ oldCell: value })
    this.props.showCell(item)
    this.props.handleForm(items)
  }

  render() {
    return (
      <div className="outerContainer">
        <h2>Select a Content Block</h2>
        <table className="leftContainer1">
          <tbody>{[this.renderTableRows()]}</tbody>
        </table>
      </div>
    )
  }

  renderTableRows = () => {
    if (!this.props.items)
      return (
        <tr key={0}>
          <td />
          <td>Loading...</td>
        </tr>
      )
    return this.props.items.map((item, i) => (
      <tr key={i}>
        {item.header ? (
          <td>
            <p>{item.type}</p>
          </td>
        ) : (
          <td>
            <button
              className={`attendee-selector__name${item.boolName === true ? '--gray' : ''}`}
              value={i}
              onClick={this.handleInputChange}
            >
              {item.type}
            </button>
          </td>
        )}
      </tr>
    ))
  }
}

export default CellSelectView
