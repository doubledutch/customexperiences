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
import Background from './iPhone.png'
import LandingPage from './PreviewCells.js'
import SpeakerCarousel from './SpeakerCarousel.js'

export default class ContentPreview extends PureComponent {

  render() {
    const { content, change } = this.props
    const sectionStyle = {
      backgroundImage: `url(${Background})`
    }

    return (
      <div className="content-preview">
        <div className="phoneBox" style={sectionStyle}>
          <div className="phoneScroll">
            { this.editorFor(content) }
          </div>
        </div>
      </div>
    )
  }

  editorFor = (details) => {
    switch (details.type) {
      case 'Landing Page Cell': return <div>
        <LandingPage {...details} />
      </div>
      case 'Speaker Highlight Cell': return <div>
        <SpeakerCarousel {...details} />
    </div>
      default: return <div/>
    }
  }
}
