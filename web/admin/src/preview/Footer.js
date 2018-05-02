import React, { Component } from 'react'
import ReactNative, { TouchableOpacity, Text, View, Image } from 'react-native'

export default class Footer extends Component {
  constructor(props) {
      super(props)
  }

  render() {
    const { footer, buttonURL, buttonText } = this.props
    if (footer) {
      return (
        <View style={{backgroundColor: 'white'}}>
          <TouchableOpacity style={{marginTop:0}}>
            <View style={s.footerButton}>
              <Text style={s.footerButtonText}>{buttonText.trim()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        <View/>
      )
    }
  }
  
}

const s = ReactNative.StyleSheet.create({
  footerButton : {
    backgroundColor: '#009DCD',
    borderRadius:4,
    padding:10, 
    margin: 20, 
  },
  footerButtonText : {
    color:'white',
    textAlign:'center',
    fontSize:16
  }
  
});
