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

import React, { PureComponent } from 'react'
import Background from './icons/iPhone.png'
import LandingPage from './preview/PreviewCells.js'
import SpeakerCarousel from './preview/SpeakerCarousel.js'
import SmallView from './preview/SmallView.js'
import DualSmallViews from './preview/DualSmallViews.js'
import ImageSquares from './preview/ImageSquares.js'
import Squares from './preview/Squares.js'
import ImageCarousel from './preview/ImageCarousel.js'
import OneImage from './preview/OneImage.js'
import TwoImage from './preview/TwoImage.js'
import TextView from './preview/Text.js'
import ButtonFooter from './preview/ButtonFooter.js'

export default class ContentPreview extends PureComponent {
  render() {
    const { content } = this.props
    const sectionStyle = {
      backgroundImage: `url(${Background})`
    }

    return (
      <div className="content-preview">
        <div className="phoneBox" style={sectionStyle}>
          <div className="phoneScroll">
            { this.getComponent(content) }
          </div>
        </div>
      </div>
    )
  }

  getComponent = (details) => {
    switch(details.type) {
      case "Landing Page Cell" :
        return(
          <LandingPage {...details} formBools = {this.props.formBools}/>
        )
      case 'Details Cell':
        return( 
          <SmallView {...details}/>
        )
      case "Dual Details Cell" :
        return(
          <DualSmallViews {...details}/>
      )
      case "Squares Cell":
        return(
          <ImageSquares {...details}/>
        )
      case "Text Squares Cell":
        return(
          <Squares {...details}/>
        )
      case "Image Carousel":
        return(
          <ImageCarousel {...details}/>
        )
      case "Speaker Highlight Cell":
        return(
          <SpeakerCarousel {...details}/>
        )
      case "Image Cell":
        return(
          <OneImage {...details}/>
        )
      case "Dual Images Cell":
        return(
          <TwoImage {...details}/>
        )
      case "Text Cell":
        return(
          <TextView {...details}/>
        )
      case "Footer Cell":
        return(
          <ButtonFooter {...details}/>
        )
    }
  }
}
