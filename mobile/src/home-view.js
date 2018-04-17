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
import ReactNative, {
  Platform, Text, TextInput, View, ScrollView
} from 'react-native'
import client, { TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import { ConfigurableScroll } from '@doubledutch/rn-components'
const fbc = FirebaseConnector(client, 'customexperiences')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      componentConfigs : [],
      templates: [],
      i: 0
    }
    this.signin = fbc.signin()
    .then(user => this.user = user)

    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    fbc.signinAdmin()
    .then(user => {
      const templateRef = fbc.database.public.adminRef('templates')
      templateRef.on('child_added', data => {
        this.setState({ templates: [...this.state.templates, {...data.val(), key: data.key }]})
        this.findConfig()
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
        this.setState({templates: newArray})
        this.findConfig()
      })
    })
  }

  //findConfig is our function to find the current Template to show after they have all been downloaded. 
  // We first need to find the current time which is stored as today and create a few trackable variables. W
  // We then run a loop with each template as each template has a saved publish time stored in the same format. 
  // As we run our loop we are tracking the current template that matches our needs of being less then the current time but greater then the current tracked time.
  // This is all possible by using UTC as we know anything less then today is potentially presentable to a user and yet anything greater then the currentTime variable must be the most recent.
  
  findConfig = () => {
    var templates = this.state.templates
    const today = new Date().getTime()
    var currentI = 0
    var currentTime = 0

    for (var i in templates) {
      var template = templates[i]
      if (template[0].publishDate) {
        if (template[0].publishDate < today && template[0].publishDate > currentTime) {
          currentTime = template[0].publishDate
          currentI = i
        }
      }
    }

    var items = []
    var template = this.state.templates[currentI]
    for (var i in template){
      if (i !== 0) {
        items = items.concat(template[i])
      }
    }
    
    this.setState({componentConfigs: items})
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TitleBar title={client.currentEvent.name} client={client} />
        <ConfigurableScroll componentConfigs={this.state.componentConfigs} />
      </View>
    )
  }
}

