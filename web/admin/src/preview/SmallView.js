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
import ReactNative, { Text, View, Image } from 'react-native'

export default class SmallView extends Component {
  render() {
    const { image, title, description } = this.props
    return(
      <View>
        <View style={s.top} />
        <View style={s.main}>
          {(image ? <Image style={s.image} source={{uri: image}} alt=""/> : <View style={s.image}/>)}
          <View style={s.info}>
            <Text style={s.title}>{title}</Text>
            <Text style={s.description}>{description}</Text>
          </View>
        </View>
      </View>
    )
  }
}
    
const s = ReactNative.StyleSheet.create({
  top: {
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
    height: 10,
    flex: 1,
    backgroundColor: '#E8E8E8'
  },
  main: {
    padding: 0,
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  image: {
    height: 110,
    width: 110
  },
  info: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 15,
    marginBottom: 15,
    flexDirection: 'column',
    flex: 1
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    color: '#364247'
  },
  description: {
    fontSize: 14,
    color: '#364247'
  }
})
    