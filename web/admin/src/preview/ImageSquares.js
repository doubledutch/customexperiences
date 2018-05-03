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
import ReactNative, { TouchableOpacity, Text, View, Image, Dimensions } from 'react-native'
import Footer from './Footer'
import Header from './Header'


export default class ImageSquares extends Component {
  constructor(props) {
      super(props)
  }

  render(){
    const width = 286 / 2 - 20
    const height = width
    const { footer, buttonURL, buttonText, header, title, des, image1, image2, image3, image4, intro } = this.props
      return (
        <View style={s.component}>
          <View style={s.top}/>
          <Header
          header = {header}
          title = {title}
          des = {des}
          intro = {intro}
          />
          <View style={s.box}>
            <View style={{flexDirection:'row'}}>
              <View style={s.imageBoxLeft}>
                {(image1 ? <Image style={{width, height}} source={{uri: image1}} alt=""/> : <View style={{width, height}}/>)}
              </View>
              <View style={s.imageBoxRight}>
                {(image2 ? <Image style={{width, height}} source={{uri: image2}} alt=""/> : <View style={{width, height}}/>)}
              </View>   
            </View>
            <View style={s.lowerRow}>
              <View style={s.imageBoxLeft}>
                {(image3 ? <Image style={{width, height}} source={{uri: image3}} alt=""/> : <View style={{width, height}}/>)}
              </View>
              <View style={s.imageBoxRight}>
                {(image4 ? <Image style={{width, height}} source={{uri: image4}} alt=""/> : <View style={{width, height}}/>)}
              </View>
            </View>
          </View>
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
    component: {
        padding: 0, 
        borderColor:'#D8D8D8',
        borderBottomWidth: 1
    },

    top: {
        borderColor:'#D8D8D8',
        borderBottomWidth:1, 
        height: 10, 
        flex: 1
    },

    box: {
        backgroundColor:'#FFFFFF',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#D8D8D8'
    },

    imageBoxLeft: {
        borderRightWidth:1,
        borderColor:'#D8D8D8',
        flex:1,
        padding:10,
        alignItems:'center'
    },

    lowerRow: {
        flexDirection:'row',
        borderTopWidth:1,
        borderColor:'#D8D8D8'
    },
    imageBoxRight: {
        flex:1,
        padding:10,
        alignItems:'center'
    }
  
  });