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
import ReactNative, { Text, View, Image, TouchableOpacity, Linking } from 'react-native'
import Footer from './Footer'
import Header from './Header'

export default class DualSmallViews extends Component {
  render() {
    const { image1, title1, des1, image2, title2, des2, url1, url2, footer, buttonURL, buttonText, header, title, des, intro } = this.props
    return(
      <View>
        <View style={s.top} />
        <Header
        header = {header}
        title = {title}
        des = {des}
        intro = {intro}
        />
        <TouchableOpacity style={s.main}>
          {(image1 ? <Image style={s.image} source={{uri: image1}} alt=""/> : <Image style={s.image} source={require('../icons/imageplaceholdersquare.png')} alt=""/>)}
          <View style={s.info}>
            <Text style={s.title}>{title1}</Text>
            <Text style={s.description}>{des1}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={s.main2}>
          {(image2 ? <Image style={s.image} source={{uri: image2}} alt=""/> : <Image style={s.image} source={require('../icons/imageplaceholdersquare.png')} alt=""/>)}
          <View style={s.info}>
            <Text style={s.title}>{title2}</Text>
            <Text style={s.description}>{des2}</Text>
          </View>
        </TouchableOpacity>
        <Footer
        footer={footer}
        buttonURL={buttonURL}
        buttonText={buttonText}
        />
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
    borderTopWidth:1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  main2: {
    padding: 0,
    marginTop: 10,
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
    borderTopWidth:1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  image: {
    margin: 10,
    height: 90,
    width: 90,
    resizeMode: 'contain'
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