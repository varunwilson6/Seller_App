import {StyleSheet,PixelRatio} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {BUTTON_COLOR,APP_COLOR,LIGHT_GRAY,FACEBOOK_HEX} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  pdf:{
    flex:1,
    width:SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})
