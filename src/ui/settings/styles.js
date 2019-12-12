import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  text:{
    marginLeft:SCREEN_HEIGHT/50,
    color:'gray',
    fontSize:14,
    textAlign:'left',
    marginTop:SCREEN_HEIGHT/33.3,
    alignSelf:"flex-start",
    fontFamily:"DIN-Regular"
  },
  lang:{
    marginRight:SCREEN_HEIGHT/25,
    color:'gray',
    fontSize:14,
    textAlign:'right',
    marginTop:SCREEN_HEIGHT/33.3,
    alignSelf:"flex-end",
    marginLeft:"auto",
    fontFamily:"DIN-Regular"
  },
  settingsContainer:{
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT/11.11,
    backgroundColor:'white',
    
  },
  arrow:{
    marginTop:SCREEN_HEIGHT/38.46,
    marginRight:SCREEN_HEIGHT/33.3,
    textAlign:'right',
  },
  horzLine:{
     height:0.6,
    backgroundColor:'lightgray',
    width:SCREEN_WIDTH,
    marginLeft:SCREEN_HEIGHT/50
  },
  grayDiv:{
    backgroundColor:LIGHT_GRAY,
    height:SCREEN_HEIGHT/62.5,
    width:SCREEN_WIDTH
  },
  button:{
    left:SCREEN_HEIGHT/33.3,
    width:SCREEN_WIDTH-SCREEN_HEIGHT/16.6,
    height:40,
    bottom:SCREEN_HEIGHT/12.5,
    position:'absolute',
    backgroundColor:'white',
    borderWidth:1,
    borderColor:BUTTON_COLOR
  }
})
