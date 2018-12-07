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

export default class FormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: false,
    }
  }

  handleInputChange = event => {
    const { name, type, checked, value } = event.target
    const path = name.split('.')
    const { newCell } = this.props
    const obj = path
      .slice(0, path.length - 1)
      .reduce((obj, prop) => obj[isNaN(prop) ? prop : +prop], newCell)
    obj[path[path.length - 1]] = value
    if (type === 'checkbox') {
      obj[path[path.length - 1]] = checked
    }
    this.props.updateCell(newCell)
  }

  formInput = (title, name, value) => (
    <label className="boxTitle">
    {title}:
      <input
      className="box"
      name={name}
      type="text"
      value={value}
      onChange={this.handleInputChange} />
    </label>
  )

  checkQuestions = () => (
      <span>
        <div>
          <label className="checkBoxTitle">
            Header:
            <input
              className="checkBox"
              name="header"
              type="checkBox"
              checked={this.props.newCell.header}
              onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label className="checkBoxTitle">
            Footer:
            <input
              className="checkBox"
              name="footer"
              type="checkbox"
              checked={this.props.newCell.footer}
              onChange={this.handleInputChange} />
          </label>
        </div>
      </span>
    )

  headerInfo = () => (
      <span>
        { (this.props.newCell.header) ? <span>
          <label className="boxTitle">
            Intro: 
            <input
              className="box"
              name="intro"
              type="text"
              maxLength="50"
              value={this.props.newCell.intro}
              onChange={this.handleInputChange} />
          </label>
          <label className="boxTitle">
            Title:
            <input
            className="box"
              name="title"
              type="text"
              maxLength="50"
              required
              value={this.props.newCell.title}
              onChange={this.handleInputChange} />
          </label>
          <label className="boxTitle">
            Description:
            <input
              className="box"
              name="des"
              type="text"
              value={this.props.newCell.des}
              maxLength="500"
              onChange={this.handleInputChange} />
          </label>
          </span> : <label className="boxTitle">
            Title:
            <input
            className="box"
              name="title"
              type="text"
              maxLength="100"
              required
              value={this.props.newCell.title}
              onChange={this.handleInputChange} />
          </label> }
      </span>
    )

  footerInfo = () => (
      <span>
        { (this.props.newCell.footer) ? <span>
          <label className="boxTitle">
          Footer Button Text:
          <input
            className="box"
            name="buttonText"
            type="text"
            required
            maxLength="30"
            value={this.props.newCell.buttonText}
            onChange={this.handleInputChange} />
          </label>
          <label className="boxTitle">
            Footer Button URL:
            <input
              className="box"
              name="buttonURL"
              type="text"
              required
              value={this.props.newCell.buttonURL}
              onChange={this.handleInputChange} />
          </label>
        </span> : null }
      </span>
    )

  speakerInfo = i => {
    let name = `speakerInfo.${i}.name`
    let image = `speakerInfo.${i}.image`
    let title = `speakerInfo.${i}.title`
    let company = `speakerInfo.${i}.company`
    let des = `speakerInfo.${i}.des`
    let link = `speakerInfo.${i}.URL`
    return (
      <div>
        <label className="boxTitle">
          Speaker {i + 1} Name:
          <input
            className="box"
            name={name}
            type="text"
            required
            maxLength="50"
            value={this.props.newCell.speakerInfo[i].name}
            onChange={this.handleInputChange}
          />
        </label>
        <label className="boxTitle">
          Speaker {i + 1} Image:
          <input
            className="box"
            name={image}
            type="text"
            required
            value={this.props.newCell.speakerInfo[i].image}
            onChange={this.handleInputChange}
          />
        </label>
        <label className="boxTitle">
          Speaker {i + 1} Title:
          <input
            className="box"
            name={title}
            type="text"
            required
            maxLength="30"
            value={this.props.newCell.speakerInfo[i].title}
            onChange={this.handleInputChange}
          />
        </label>
        <label className="boxTitle">
          Speaker {i + 1} Company:
          <input
            className="box"
            name={company}
            type="text"
            maxLength="30"
            value={this.props.newCell.speakerInfo[i].company}
            onChange={this.handleInputChange}
          />
        </label>
        <label className="boxTitle">
          Speaker {i + 1} Info:
          <input
            className="box"
            name={des}
            type="text"
            value={this.props.newCell.speakerInfo[i].des}
            onChange={this.handleInputChange}
          />
        </label>
        <label className="boxTitle">
          Speaker {i + 1} Link:
          <input
            className="box"
            name={link}
            type="text"
            value={this.props.newCell.speakerInfo[i].URL}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    )
  }

  videoInfo = i => {
    let video = `videoInfo.${i}.video`
    return (
      <div>
        <label className="boxTitle">
          Video {i + 1} URL:
          <input
            className="box"
            name={video}
            type="text"
            required
            value={this.props.newCell.videoInfo[i].video}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    )
  }

  imageInfo = i => {
    let image = `imageInfo.${i}.image`
    let link = `imageInfo.${i}.URL`
    return (
      <div>
        <label className="boxTitle">
          Image {i + 1} URL:
          <input
            className="box"
            name={image}
            type="text"
            required
            value={this.props.newCell.imageInfo[i].image}
            onChange={this.handleInputChange}
          />
        </label>
        <label className="boxTitle">
          Image {i + 1} Link:
          <input
            className="box"
            name={link}
            type="text"
            value={this.props.newCell.imageInfo[i].URL}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    )
  }

  videoValidation = link => {
    if (link.length) return !link.match(/^(https?\:\/\/)(www\.)?(youtube\.com|youtu\.?be)\/.+$/)
    else return false
  }

  videoCarouselVal = (videos) => {
    let status = false
    videos.forEach(item => {
      const currentVid = this.videoValidation(item.video)
      if (currentVid) status = currentVid
    })
    return status
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.handleSubmit(event)
  }

  showForm = () => {
    if (this.props.showFormBool === true) {
      if (this.props.newCell.type === 'Landing Page Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            <div>
              <label className="checkBoxTitle">
                Footer:
                <input
                  className="checkBox"
                  name="footer"
                  type="checkbox"
                  value={this.props.newCell.footer}
                  checked={this.props.newCell.footer}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            {this.props.formBools.boldBool || this.props.newCell.headline ? (
              <label className="boxTitle">
                Bold Headline:
                <input
                  className="box"
                  name="headline"
                  type="text"
                  required
                  maxLength="20"
                  value={this.props.newCell.headline}
                  onChange={this.handleInputChange}
                />
              </label>
            ) : null}
            {this.headerInfo()}
            {this.props.formBools.videoBool ||
            (this.props.newCell.video && !this.props.newCell.image) ? (
              <label className="boxTitle">
                Video Link:
                <input
                  name="video"
                  type="text"
                  className="box"
                  required
                  value={this.props.newCell.video}
                  onChange={this.handleInputChange}
                />
              </label>
            ) : null}
            {this.props.formBools.imageBool ||
            (this.props.newCell.image && !this.props.newCell.video) ? (
              <label className="boxTitle">
                Image Link:
                <input
                  name="image"
                  type="text"
                  className="box"
                  required
                  value={this.props.newCell.image}
                  onChange={this.handleInputChange}
                />
              </label>
            ) : null}
            {this.footerInfo()}
            <input
              type="submit"
              value="Submit Content"
              className="formButton"
              disabled={this.videoValidation(this.props.newCell.video)}
            />
          </form>
        )
      }
      if (this.props.newCell.type === 'Video Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Video Link:
              <input
                name="video"
                type="text"
                className="box"
                required
                value={this.props.newCell.video}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input
              type="submit"
              value="Submit Content"
              className="formButton"
              disabled={this.videoValidation(this.props.newCell.video)}
            />
          </form>
        )
      }
      if (this.props.newCell.type === 'Text Squares Cell') {
        return (
          <form onSubmit={this.handleSubmit} className="formBox">
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Image 1:
              <input
                name="image1"
                type="text"
                className="box"
                required
                value={this.props.newCell.image1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 1 Text:
              <input
                name="text1"
                type="text"
                className="box"
                required
                value={this.props.newCell.text1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 1 Link URL:
              <input
                name="url1"
                type="text"
                className="box"
                required
                value={this.props.newCell.url1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2:
              <input
                name="image2"
                type="text"
                className="box"
                required
                value={this.props.newCell.image2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2 Text:
              <input
                name="text2"
                type="text"
                className="box"
                required
                value={this.props.newCell.text2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2 Link URL:
              <input
                name="url2"
                type="text"
                className="box"
                required
                value={this.props.newCell.url2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 3:
              <input
                name="image3"
                type="text"
                className="box"
                required
                value={this.props.newCell.image3}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 3 Text:
              <input
                name="text3"
                type="text"
                className="box"
                required
                value={this.props.newCell.text3}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 3 Link URL:
              <input
                name="url3"
                type="text"
                className="box"
                required
                value={this.props.newCell.url3}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 4:
              <input
                name="image4"
                type="text"
                className="box"
                required
                value={this.props.newCell.image4}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 4 Text:
              <input
                className="box"
                name="text4"
                type="text"
                required
                value={this.props.newCell.text4}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 4 Link URL:
              <input
                name="url4"
                type="text"
                className="box"
                required
                value={this.props.newCell.url4}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input type="submit" value="Submit Content" className="formButton" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Squares Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Image 1:
              <input
                className="box"
                name="image1"
                type="text"
                required
                value={this.props.newCell.image1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 1 Link URL:
              <input
                name="url1"
                type="text"
                className="box"
                required
                value={this.props.newCell.url1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2:
              <input
                className="box"
                name="image2"
                type="text"
                required
                value={this.props.newCell.image2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2 Link URL:
              <input
                name="url2"
                type="text"
                className="box"
                required
                value={this.props.newCell.url2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 3:
              <input
                className="box"
                name="image3"
                type="text"
                required
                value={this.props.newCell.image3}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 3 Link URL:
              <input
                name="url3"
                type="text"
                className="box"
                required
                value={this.props.newCell.url3}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 4:
              <input
                className="box"
                name="image4"
                type="text"
                required
                value={this.props.newCell.image4}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 4 Link URL:
              <input
                name="url4"
                type="text"
                className="box"
                required
                value={this.props.newCell.url4}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input type="submit" value="Submit Content" className="formButton" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Squares Row') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
          {this.checkQuestions()}
          {this.headerInfo()}
          {this.props.newCell.imageInfo.map((item, i) => {
            return (
              this.imageInfo(i)
            )
          })}
          {this.footerInfo()}
          <input type="button" onClick={()=>this.props.handleNewImage()} value="Add New Image +" className="speakerButton"/>
          <input type="button" onClick={()=>this.props.deleteLastImage()} value="Delete Last Image" className="deleteSpeakerButton"/>
          <input className="formButton" type="submit" value="Submit Content" />
        </form>
      )
    }

    if (this.props.newCell.type === "Video Carousel"){
      return(
        <form className="formBox" onSubmit={this.handleSubmit}>
          {this.checkQuestions()}
          {this.headerInfo()}
          {this.props.newCell.videoInfo.map((item, i) => {
            return (
              this.videoInfo(i)
            )
          })}
          {this.footerInfo()}
          <input type="button" onClick={()=>this.props.handleNewVideo()} value="Add New Video +" className="speakerButton"/>
          <input type="button" onClick={()=>this.props.deleteLastVideo()} value="Delete Last Video" className="deleteSpeakerButton"/>
          <input className="formButton" type="submit" value="Submit Content" disabled={this.videoCarouselVal(this.props.newCell.videoInfo)}/>
        </form>
      )
    }

      if (this.props.newCell.type === 'Speaker Highlight Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            {this.props.newCell.speakerInfo.map((item, i) => (
                  this.speakerInfo(i)
                ))}
            {this.footerInfo()}
            <input
              type="button"
              onClick={() => this.props.handleNewSpeaker()}
              value="Add New Speaker +"
              className="speakerButton"
            />
            <input
              type="button"
              onClick={() => this.props.deleteLastSpeaker()}
              value="Delete Last Speaker"
              className="deleteSpeakerButton"
            />
            <input type="submit" value="Submit Content" className="formButton" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Image Carousel') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            {this.props.newCell.imageInfo.map((item, i) => (
              this.imageInfo(i)
            ))}
            {this.footerInfo()}
            <input
              type="button"
              onClick={() => this.props.handleNewImage()}
              value="Add New Image +"
              className="speakerButton"
            />
            <input
              type="button"
              onClick={() => this.props.deleteLastImage()}
              value="Delete Last Image"
              className="deleteSpeakerButton"
            />
            <input className="formButton" type="submit" value="Submit Content" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Video Carousel') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            {this.props.newCell.videoInfo.map((item, i) => (
            this.videoInfo(i)
          ))}
            {this.footerInfo()}
            <input
              type="button"
              onClick={() => this.props.handleNewVideo()}
              value="Add New Video +"
              className="speakerButton"
            />
            <input
              type="button"
              onClick={() => this.props.deleteLastVideo()}
              value="Delete Last Video"
              className="deleteSpeakerButton"
            />
            <input className="formButton" type="submit" value="Submit Content" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Dual Details Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Title 1:
              <input
                className="box"
                name="title1"
                type="text"
                required
                value={this.props.newCell.title1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 1:
              <input
                className="box"
                name="image1"
                type="text"
                required
                value={this.props.newCell.image1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Description 1:
              <input
                className="box"
                name="des1"
                type="text"
                required
                value={this.props.newCell.des1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Link 1:
              <input
                className="box"
                name="url1"
                type="text"
                required
                value={this.props.newCell.url1}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Title 2:
              <input
                className="box"
                name="title2"
                type="text"
                required
                value={this.props.newCell.title2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2:
              <input
                className="box"
                name="image2"
                type="text"
                required
                value={this.props.newCell.image2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Link 2:
              <input
                className="box"
                name="url2"
                type="text"
                required
                value={this.props.newCell.url2}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Description 2:
              <input
                className="box"
                name="des2"
                type="text"
                required
                value={this.props.newCell.des2}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input type="submit" value="Submit Content" className="formButton" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Details Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            <label className="boxTitle">
              Title
              <input
                className="box"
                name="title"
                type="text"
                required
                value={this.props.newCell.title}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image Link:
              <input
                className="box"
                name="image"
                type="text"
                required
                value={this.props.newCell.image}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Description:
              <input
                className="box"
                name="description"
                type="text"
                required
                value={this.props.newCell.description}
                onChange={this.handleInputChange}
              />
            </label>
            <input type="submit" value="Submit Content" className="formButton" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Image Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Image Link:
              <input
                className="box"
                name="imageInfo.image"
                type="text"
                required
                value={this.props.newCell.imageInfo.image}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input className="formButton" type="submit" value="Submit Content" />
          </form>
        )
      }
      if (this.props.newCell.type === 'Dual Images Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Image 1 Link:
              <input
                className="box"
                name="imageInfo.0.image"
                type="text"
                required
                value={this.props.newCell.imageInfo[0].image}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Image 2 Link:
              <input
                className="box"
                name="imageInfo.1.image"
                type="text"
                required
                value={this.props.newCell.imageInfo[1].image}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input className="formButton" type="submit" value="Submit Content" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Text Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            {this.checkQuestions()}
            {this.headerInfo()}
            <label className="boxTitle">
              Content:
              <input
                className="box"
                name="content"
                type="text"
                required
                value={this.props.newCell.content}
                onChange={this.handleInputChange}
              />
            </label>
            {this.footerInfo()}
            <input className="formButton" type="submit" value="Submit Content" />
          </form>
        )
      }

      if (this.props.newCell.type === 'Footer Cell') {
        return (
          <form className="formBox" onSubmit={this.handleSubmit}>
            <label className="boxTitle">
              Footer Button 1 Text:
              <input
                className="box"
                name="buttons.0.buttonTitle"
                type="text"
                required
                maxLength="30"
                value={this.props.newCell.buttons[0].buttonTitle}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Footer Button 1 URL:
              <input
                className="box"
                name="buttons.0.buttonURL"
                type="text"
                required
                value={this.props.newCell.buttons[0].buttonURL}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Footer Button 2 Text:
              <input
                className="box"
                name="buttons.1.buttonTitle"
                type="text"
                required
                maxLength="30"
                value={this.props.newCell.buttons[1].buttonTitle}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="boxTitle">
              Footer Button 2 URL:
              <input
                className="box"
                name="buttons.1.buttonURL"
                type="text"
                required
                value={this.props.newCell.buttons[1].buttonURL}
                onChange={this.handleInputChange}
              />
            </label>
            <input className="formButton" type="submit" value="Submit Content" />
          </form>
        )
      }
    }
  }

  render() {
    return (
      <div className="outerContainer">
        <h2>Edit the Content</h2>
        <span className="leftContainer">
          {this.props.showFormBool ? (
            <div
              style={{ flex: 1, height: '20', alignItems: 'flex-end', backgroundColor: '#FFFFFF' }}
            >
              <button className="formCloseButton" onClick={this.props.closeForm}>
                X
              </button>
            </div>
          ) : null}
          {this.showForm()}
        </span>
      </div>
    )
  }
}
