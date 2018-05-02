import React, { Component } from 'react'
import ReactNative, { TouchableOpacity, Text, View, Image } from 'react-native'

export default class Header extends Component {
  constructor(props) {
      super(props)
    }

    render() {
      const { header, title, des, intro } = this.props
      if (header) {
        return (
          <View style={{backgroundColor: 'white'}}>
            <View style={s.headerBox}>
              {intro.length ? <Text style={s.header}>{intro}</Text> : null}  
              {title.length ? <Text style={s.subHeader}>{title}</Text> : null}
            </View>
            {des.length ? <Text style={s.description}>{des}</Text> : null}
          </View>
        )
      }
      else {
        return (
          <View style={{backgroundColor: 'white'}}>
            {title.length ? <Text style={s.header2}>{title}</Text> : null}
          </View>
        )
      }
    }
}

const s = ReactNative.StyleSheet.create({
  headerBox : {
    marginTop: 20,
    marginBottom: 20,
  },
  header : {
    textAlign: "center",
    fontSize: 26,
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 0,
    marginBottom: 0,
    color: '#364247'
  },
  subHeader : {
    textAlign: "center",
    fontSize: 26,
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginBottom:0,
    marginTop: 0,
    color: '#364247'
  },
  description : {
    textAlign: "center",
    fontSize: 14,
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 0,
    marginBottom: 25,
    color: '#364247'
  },
  header2: {
    textAlign: "center",
    fontSize: 18,
    flex: 1,
    marginLeft: 15,
    marginTop: 5,
    marginBottom:5,
    color: '#364247'
  }

});