import React, { Component } from 'react';
import ReactNative, {Button, NativeEventEmitter, Platform} from 'react-native';
import Footer from "./Footer.js"
const { TouchableOpacity, TouchableHighlight, Text, View, Image, WebView, Dimensions, Linking } = ReactNative

export default class LandingPage extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  render() {
    console.log(this.props.formBools)
    return (
      this.viewPage()
    )
  }

  viewPage = () => {
    const color = '#009DCD'
    const { headline, title, des, excludeNativeComponents, video, bold, footer, buttonURL, buttonText, intro } = this.props
    if (bold){
      return(
      <View style={{borderBottomWidth:1, borderColor:'#D8D8D8'}}>
        <View style={s.border}/>
        <View style={{backgroundColor:'#00B9C2'}}>
          <Text style={[s.headlineText, {color}]}>{headline}</Text>
        </View>
        <View style={s.dimensionStyle}>
          {(this.props.formBools.imageBool) ? <Image source={this.props.image ? {uri: this.props.image} : require('../icons/imageplaceholder.png')} style={{flex:1, resizeMode: 'contain'}}/> : null}
          {(this.props.formBools.videoBool) ? <Image style={s.dimensionStyle} source={require('../icons/videoplaceholder.png')} alt="video" /> : null }
        </View>
        <View style={s.box}>
          {intro.length ? <Text style={{textAlign:'center',fontSize:25, color: '#364247'}}>{intro}</Text> : null}
          {title.length ? <Text style={{textAlign:'center',fontSize:25, color: '#364247'}}>{title}</Text> : null}
          {des.length ? <Text style={{textAlign:'center',fontSize:16,padding:20, color: '#364247'}}>{des}</Text> : null}
        </View>
        <Footer
          footer={footer}
          buttonURL={buttonURL}
          buttonText={buttonText}
        />
      </View>
      )
    }
    else {
      return (
      <View style={{borderBottomWidth:1, borderColor:'#D8D8D8'}}>
        <View style={s.border}/>
        <View style={s.box}>
          {intro.length ? <Text style={{textAlign:'center',fontSize:25, color: '#364247'}}>{intro}</Text> : null}
          {title.length ? <Text style={{textAlign:'center',fontSize:25, color: '#364247'}}>{title}</Text> : null}
          {des.length ? <Text style={{textAlign:'center',fontSize:16,padding:20, color: '#364247'}}>{des}</Text> : null}
        </View>
        <View style={s.dimensionStyle}>
          {(this.props.formBools.imageBool) ? <Image source={this.props.image ? {uri: this.props.image} : require('../icons/imageplaceholder.png')} style={{flex:1, resizeMode: 'contain'}}/> : null}
          {(this.props.formBools.videoBool) ? <Image style={s.dimensionStyle} source={require('../icons/videoplaceholder.png')} alt="video" /> : null }
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
}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }, 
  videoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
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
    backgroundColor: 'red',
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
    height: 180,
    justifyContent: 'center',
    borderColor: "#D8D8D8",
    borderWidth: 1,
    // backgroundColor: "#FFFFFF"
  }
})