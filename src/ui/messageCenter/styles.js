import {StyleSheet,PixelRatio,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {BUTTON_COLOR,APP_COLOR,LIGHT_GRAY,FACEBOOK_HEX} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  text:{
    marginHorizontal:10,
    fontSize:15,
    color:'black',
    marginTop:20,
    fontFamily:"DIN-Regular"
  },
  topSearchNav:{
    backgroundColor:APP_COLOR,
    height:Platform.OS=="ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?88:64,
    justifyContent:'center',
    width:SCREEN_WIDTH
  },
  navTitle:{
    marginHorizontal:10,
    color:'white',
    marginTop:Platform.OS=="ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?44:20,
    fontSize:16,
    textAlign:'center',
    fontFamily:"DIN-Regular"
  },
  horzLine:{
    height:0.6,
    backgroundColor:'lightgray',
    width:SCREEN_WIDTH
  },
   footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
})
