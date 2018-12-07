import ReactNative, { Linking, Alert } from 'react-native'

export function linkCheck(string) {
  const link = string.trim()
  if (link) {
    Linking.canOpenURL(link)
      .then(supported => {
        if (!supported) {
          Alert.alert('This link is unavailable')
        } else {
          Linking.openURL(link)
        }
      })
      .catch(err => Alert.alert('This link is unavailable'))
  } else Alert.alert('This link is unavailable')
}
