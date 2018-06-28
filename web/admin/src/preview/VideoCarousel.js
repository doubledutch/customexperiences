import React, { Component } from 'react'
import ReactNative, { Text, View, Image, Dimensions, WebView, Platform, TouchableHighlight } from 'react-native'
import Footer from './Footer'
import Header from './Header'


export default class VideoCarousel extends Component {
  constructor(props) {
    super(props)
  }

  carouselCells = (width) => {
    const dimensionStyle = {
      width : width,
      height : width * .5625
    }
    return(
      this.props.videoInfo.map(((item, i) =>                
        <View key={i} style={[s.cell, dimensionStyle]} activeOpacity={1.0}>
          {this.renderImage(item)}
       </View> 
      ))
    )
  }

  renderImage = (item) => {
    return (
      <View style={s.dimensionStyle}>
        <Image style={s.dimensionStyle} source={require('../icons/videoplaceholder.png')} alt="video" />
      </View>
    )
  }

  
  render() {
    const width = 286
    const { footer, buttonURL, buttonText, header, title, des, intro } = this.props
    return (
      <View style={s.component}>
        <View style={s.top}/>
        <Header
        header = {header}
        title = {title}
        des = {des}
        intro = {intro}
        />
          {this.carouselCells(width)}    
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
  cell: {
    marginBottom: 25, 
    backgroundColor:'#E8E8E8',
  },
  component: {
    marginBottom: 0, 
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    backgroundColor: "white"
  },
  top: {
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    height: 25, 
    flex: 1, 
    backgroundColor:'#E8E8E8'
  },
  container: {
    flex: 1
  }, 
  videoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  playButton: {
    height: 80,
    width: 80,
    backgroundColor: 'rgba(170,170,170,0.6)',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  playButtonText: {
    fontSize: 40,
    lineHeight: 32,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
  },
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
  headlineText: {
    fontSize:32,
    textAlign:'center',
    padding:20,
    fontWeight:'bold',
    backgroundColor: '#FFFFFF'
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderColor: 'black',
    borderWidth: 1,
  },
  box: {
    backgroundColor:'#FFFFFF',
    padding:20
  },
  border : {
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    height: 25, 
    flex: 1  
  },
  dimensionStyle : {
    flexDirection: 'row', 
    flexGrow: 1,
    aspectRatio: 1.777,
    justifyContent: 'center',
  }

});


