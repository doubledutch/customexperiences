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
import { AsyncStorage, Text, View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import client, { TitleBar } from '@doubledutch/rn-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { ConfigurableScroll } from '@doubledutch/rn-components'
import youTube from './secrets'
import LoadingView from './LoadingView'

class HomeView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      componentConfigs: [],
      templates: [],
      i: 0,
      isDisabled: true,
      logInFailed: false,
      primaryColor: '#000000',
    }
    this.signin = props.fbc.signin()
    .then(user => this.user = user)
    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    client.getCurrentEvent().then(currentEvent => this.setState({currentEvent}))
    client.getPrimaryColor().then(primaryColor => this.setState({primaryColor}))

    client.getCurrentUser().then(currentUser => {
      this.setState({currentUser})

      this.loadLocalTemplates()
      .then(localTemplates => {
        this.signin.then(() => {
          const templateRef = this.props.fbc.database.public.adminRef('templates')
            templateRef.on('value', data => {
              const templateData = data.val()
              const templateKeys = Object.keys(data.val())
              let templates = localTemplates
              templateKeys.forEach(key => {
                const currentTemplate = templates.findIndex(template => template.key === key)
                if (currentTemplate > -1) {
                  templates.splice(currentTemplate, 1)
                }
                templates.push({...templateData[key], key})
              })
              templates.forEach((template, index) => {
                const deletedTemplate = templateKeys.findIndex(key => template.key === key)
                if (deletedTemplate === -1) {
                  templates.splice(index, 1)
                }
              })
              this.saveLocalTemplates({templates})
              this.setState({templates})
              this.findConfig(templates)
          })
        }).catch(()=> this.setState({logInFailed: true, isDisabled: false}))
      })
    })
  }

  //findConfig is our function to find the current Template to show after they have all been downloaded. 
  // We first need to find the current time which is stored as today and create a few trackable variables. W
  // We then run a loop with each template as each template has a saved publish time stored in the same format. 
  // As we run our loop we are tracking the current template that matches our needs of being less then the current time but greater then the current tracked time.
  // This is all possible by using UTC as we know anything less then today is potentially presentable to a user and yet anything greater then the currentTime variable must be the most recent.
  
  findConfig = (templates) => {
    const today = new Date().getTime()
    let currentI = null
    let currentTime = 0
    for (var i in templates) {
      let template = templates[i]
      if (template[0].publishDate) {
        if (template[0].publishDate < today && template[0].publishDate > currentTime) {
          currentTime = template[0].publishDate
          currentI = i
        }
      }
    }
    let items = []
    let currentTemplate = []
    if (currentI !== null) { currentTemplate = templates[currentI]}
    for (var i in currentTemplate){
      if (i !== 0) {
        items = items.concat(currentTemplate[i])
      }
    }
    let isDisabled = false
    const isRequired = items[0].requireScroll ? items[0].requireScroll : false
    if (isRequired && items.length > 3){
      isDisabled = true
    }
    let isEqual = false
    if (this.state.componentConfigs && items) {
    isEqual = this.state.componentConfigs.reduce(function(res, v1, idx) {
      let v2 = items[idx]; // value from other array at same index
      return res && v1 === v2; // if result is true so far AND also the current values are equal
      }, true)
    }
    if (!isEqual || !this.state.componentConfigs.length){
      this.setState({componentConfigs: items, isDisabled})
    }
  }

  handleScroll = (e) => {
    const windowHeight = Dimensions.get('window').height,
    height = e.nativeEvent.contentSize.height,
    offset = e.nativeEvent.contentOffset.y;
    if( windowHeight + offset + 75 >= height ){
      this.setState({isDisabled: false})
    }
  }

  render() {
    const {currentEvent, currentUser, primaryColor} = this.state
    if (!currentEvent || !currentUser || !primaryColor) return null
    return (
      <View style={{ flex: 1 }}>
        {this.props.version ? null : (
          <TitleBar title={currentEvent.name} client={client} signin={this.signin} />
        )}
        {this.state.componentConfigs.length === 0 && (
          <LoadingView logInFailed={this.state.logInFailed} isLaunch={!!this.props.version} />
        )}
        <ConfigurableScroll
          componentConfigs={this.state.componentConfigs}
          handleScroll={this.handleScroll}
          youTubeApiKey={youTube.apiKey}
        />
        {this.props.version ? (
          <TouchableOpacity
            disabled={this.state.isDisabled}
            onPress={() => client.dismissLandingPage(false)}
            style={[
              s.launchButton,
              this.state.isDisabled ? null : { backgroundColor: primaryColor },
            ]}
          >
            <Text style={s.launchButtonText}>
              {this.state.isDisabled ? 'Scroll down to enter' : 'Take me to the Event'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

  loadLocalTemplates() {
    return AsyncStorage.getItem(this.leadStorageKey())
    .then(value => {
      if (value) {
        const templates = JSON.parse(value)
        this.findConfig(templates)
        return templates
      }
      else return []
    })
  }

  saveLocalTemplates({templates}) {
    return AsyncStorage.setItem(this.leadStorageKey(), JSON.stringify(templates))
  }

  leadStorageKey() { return `@DD:customExperiences_${this.state.currentEvent.id}_${this.state.currentUser.id}` }
}

export default provideFirebaseConnectorToReactComponent(client, 'customexperiences', (props, fbc) => <HomeView {...props} fbc={fbc} />, PureComponent)

const s = StyleSheet.create({
  launchButton: {
    height: 60,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center"
  },
  launchButtonText: {
    color: "#FFFFFF",
    fontSize: 22
  }
})

