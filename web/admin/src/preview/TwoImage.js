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
import ReactNative, { TouchableOpacity, Text, View, Image, Dimensions, Linking } from 'react-native'
import Footer from './Footer'
import Header from './Header'

export default class TwoImage extends Component {
  constructor(props) {
      super(props)
  }
  
  render(){
    const { footer, buttonURL, buttonText, header, title, des, imageInfo, intro } = this.props
    return(
      <View style={s.container}>
        <View style={s.border}/>
        <Header
        header = {header}
        title = {title}
        des = {des}
        intro = {intro}
        />
        {(imageInfo[0].image ? <Image style={s.dimensionStyle} source={{uri: imageInfo[0].image}} alt=""/> : <View style={s.dimensionStyle}/>)}
        {(imageInfo[1].image ? <Image style={s.dimensionStyle1} source={{uri: imageInfo[1].image}} alt=""/> : <View style={s.dimensionStyle1}/>)}
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
  container : {
    padding: 0,
    paddingBottom: 10, 
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    backgroundColor: "#FFFFFF"
  },
  border : {
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    height: 10, 
    flex: 1, 
    backgroundColor: "#E8E8E8"
  },
  dimensionStyle : {
    flexDirection: "row", 
    width: 286,
    height: 142,
    justifyContent: 'center',
    resizeMode: 'contain'
  },
  dimensionStyle1 : {
    flexDirection: "row", 
    width: 286,
    height: 142,
    justifyContent: 'center',
    marginTop: 10,
    resizeMode: 'contain'
  }
    
});

