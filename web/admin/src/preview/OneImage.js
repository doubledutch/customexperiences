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

export default class OneImage extends Component {
  
  render(){
    const { footer, buttonURL, buttonText, header, title, des, intro, imageInfo } = this.props
    return(
      <View style={s.container}>
        <View style={s.border}/>
        <Header
        header = {header}
        title = {title}
        des = {des}
        intro = {intro}
        />
        {(this.props.imageInfo.image ? <Image style={s.dimensionStyle} source={{uri: this.props.imageInfo.image}} alt=""/> : <Image style={s.dimensionStyle} source={require('../icons/imageplaceholdersquare.png')} alt=""/>)}
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
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
  },
  border : {
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    height: 10, 
    flex: 1  
  },
  dimensionStyle : {
    flexDirection: "row", 
    width: 286,
    height: 267,
    justifyContent: 'center',
    backgroundColor:'#FFFFFF',
    resizeMode: 'contain',
  }
  
  
});


