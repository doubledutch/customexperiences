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
import ReactNative, { TouchableOpacity, Text, View, Image, Linking, WebView } from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

export default class Twitter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const feed = this.props.feed
    return (
      <View>
        <View style={s.top} />
        <Text style={s.title}>Twitter Feed</Text>
        <WebView
          source={{
            html:
              '<html><body style="margin:0;padding:0" ><a class="twitter-timeline" data-chrome="nofooter noheader" href="https://twitter.com/hashtag/MSBuild" data-widget-id="961271059344273413">#MSBuild Tweets</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script></body></html>',
          }}
          style={{ height: 400, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
        />
      </View>
    )
  }
}

const s = ReactNative.StyleSheet.create({
  top: {
    borderColor: '#D8D8D8',
    borderBottomWidth: 1,
    height: 10,
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  title: {
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    backgroundColor: '#ffffff',
  },
})
