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
import ReactNative, {TouchableOpacity, Text, View,
  Image, TouchableHighlight,
  Dimensions, Platform, WebView, Linking
} from 'react-native'
import client, {TitleBar, Color, Avatar} from '@doubledutch/rn-client'
import Video from 'react-native-video'
import YouTube, { YouTubeStandaloneAndroid } from 'react-native-youtube'
import Footer from './Footer'
import Header from './Header'


export default class VideoView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paused: true, muted: true,
      loading: true, progress: 0.0,
      showModal: false,
    }
  }

  onPressVideo = () => {
    this.setState({
      paused: !this.state.paused
    })
  }
 
  renderYouTubePlayer(videoId) {
      // Android has special rendering because the youtube component uses fragments
      // which don't play nice in list views. I'm sure someone smarter can figure out
      // how to make that work, but I could not.
    if (Platform.OS === 'android') {
      return (
        <TouchableHighlight
        style={{ flex: 1 }}
        onPress={() => {
        YouTubeStandaloneAndroid.playVideo({
            apiKey: 'AIzaSyDO5L4KzrzG_2aiX6HWpTAR23xk5UcKTf8',
            videoId: videoId,
            autoplay: true
        })
        }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Image
              source={{ uri: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
              resizeMode='cover'
              style={ styles.video }
              />
              <View style={ styles.playButton }>
                  <Text style={ styles.playButtonText }>▶</Text>
              </View>
          </View>
        </TouchableHighlight>
      )
    } 
    else {
      return (
        <YouTube
          videoId={videoId}        // The YouTube video ID
          play={false}             // control playback of video with true/false
          fullscreen={false}       // control whether the video should play in fullscreen or inline
          loop={false}             // control whether the video should loop when ended
          onReady={e => this.setState({ isReady: true })}
          onChangeState={e => this.setState({ status: e.state })}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onError={e => this.setState({ error: e.error })}
          style = {styles.video}
        />
      )
    }
  }
  
  renderVimeoPlayer(url) {
    return (
      <WebView
        source={url}
        style={styles.video}
      />
    )
  }
  
  renderVideoPlayer(url) {
    return (
      <TouchableHighlight
      ref={(ref) => {
        console.log(ref)
      }} style={{ flex: 1 }} onPress={() => this.videoRef.presentFullscreenPlayer()}>
      <Video
        ref={(ref) => {
          console.log(ref)
        }}
        source={{ uri: url }}
        style={styles.video}
        paused={true}
      />
      </TouchableHighlight>
    )
  }
  
  renderPlayer(video) {
    if (video) {
      if (video.toLowerCase().indexOf('youtube.com') >= 0) {
        const videoId = video.replace(/.+v=(.+?)(&|$)/g, '$1')
        return this.renderYouTubePlayer(videoId)
      } 
      else if (video.toLowerCase().indexOf('vimeo.com') >= 0) {
        return this.renderVimeoPlayer(video)
      } 
      else {
        return this.renderVideoPlayer(video)
      }
    }
    return this.renderYouTubePlayer('-xAFnaYDQa4')
  }
  

  render(){
    const { footer, buttonURL, buttonText, header, title, des, video, intro } = this.props
    return(
      <View style={styles.container}>
        <View style={{borderColor:'#D8D8D8',borderBottomWidth:1, height: 25, flex: 1}}/>
        <Header
        header = {header}
        title = {title}
        des = {des}
        intro = {intro}
        />
        <View style={styles.dimensionStyle}>
            {this.renderPlayer(video)}
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

const styles = ReactNative.StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
    backgroundColor: 'red',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  container: {
    padding: 0, 
    borderColor:'#D8D8D8',
    borderBottomWidth:1
  },
  border: {
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    height: 25, 
    flex: 1
  },
  dimensionStyle : {
    flexDirection: "row", 
    flexGrow: 1,
    aspectRatio: 1.777,
    justifyContent: 'center'
  }

});
