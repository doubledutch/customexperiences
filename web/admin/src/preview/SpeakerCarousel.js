import React, { Component } from 'react'
import ReactNative, { TouchableOpacity, Text, View, Image, Dimensions, Linking } from 'react-native'
import Footer from './Footer.js'
import Header from './Header.js'

export default class SpeakerCarousel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 240,
    }
  }

  carouselCells = maxLines =>
    this.props.speakerInfo.map((item, i) => (
      <TouchableOpacity key={i} style={s.cell} activeOpacity={1.0}>
        <View style={{ flexDirection: 'row', paddingTop: 10, width: 286 }}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={s.image} />
          ) : (
            <Image style={s.image} source={require('../icons/imageplaceholdersquare.png')} alt="" />
          )}
          <View style={{ flexDirection: 'column', marginRight: 15, flex: 1 }}>
            <Text style={s.name}>{item.name}</Text>
            <Text
              numberOfLines={2}
              style={{ fontSize: 16, marginLeft: 20, marginTop: 0, color: '#364247' }}
            >
              {item.title}
              {item.company && item.title ? ',' : null} {item.company}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text numberOfLines={maxLines} style={s.cellDes}>
            {item.des}
          </Text>
        </View>
      </TouchableOpacity>
    ))

  findHeight = () => {
    const width = 286
    let setHeight = 240
    let string = 1
    const speakerString = 1
    const fontSize = 14
    const fontConstant = 2
    const CPL = width / (14 / fontConstant)
    this.props.speakerInfo.forEach(item => {
      const totalSpeaker = item.title + item.company
      if (item.des.length > string) {
        string = item.des.length
      }
    })
    const lines = Math.round(string / CPL + 0.5)
    setHeight = lines * 18 + 128
    return setHeight
  }

  findLines = () => {
    const width = 286
    const setHeight = 240
    let string = 1
    const speakerString = 1
    const fontSize = 14
    const fontConstant = 2
    const CPL = width / (14 / fontConstant)
    this.props.speakerInfo.forEach(item => {
      const totalSpeaker = item.title + item.company
      if (item.des.length > string) {
        string = item.des.length
      }
    })
    const lines = Math.round(string / CPL + 0.5)
    return lines
  }

  render() {
    const { footer, buttonURL, buttonText, header, title, des, intro } = this.props
    const maxLines = this.findLines()
    return (
      <View style={s.container}>
        <View style={s.border} />
        <Header header={header} title={title} des={des} intro={intro} />
        {this.carouselCells(maxLines)}
        <Footer footer={footer} buttonURL={buttonURL} buttonText={buttonText} />
      </View>
    )
  }
}

const s = ReactNative.StyleSheet.create({
  container: {
    marginBottom: 0,
    borderColor: '#D8D8D8',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  border: {
    borderColor: '#D8D8D8',
    borderBottomWidth: 1,
    height: 10,
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  cell: {
    width: 286,
    backgroundColor: '#E8E8E8',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  cellDes: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    fontSize: 14,
    color: '#364247',
  },
  name: {
    fontSize: 24,
    marginLeft: 20,
    marginTop: 5,
    color: '#364247',
  },
  image: {
    marginLeft: 15,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 10,
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
  },
})
