import {StyleSheet,PixelRatio} from 'react-native';
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
  textfield:{
    marginHorizontal:SCREEN_HEIGHT/50,
    fontSize:15,
    color:'gray',
    fontFamily:"DIN-Regular"
  },
  description:{
  	marginHorizontal:SCREEN_HEIGHT/50,
    height:150,
    borderWidth:0.6,
    borderColor:'lightgray',
    marginTop:SCREEN_HEIGHT/33.3,
    padding:SCREEN_HEIGHT/50
  },
  button:{
    left:SCREEN_HEIGHT/33.3,
    width:SCREEN_WIDTH - SCREEN_HEIGHT/16.6,
    height:44,
    backgroundColor:BUTTON_COLOR,
    position:'absolute',
    bottom:SCREEN_HEIGHT/50,
    justifyContent:'center'
  },
  buttonTxt:{
    color:'white',
    fontWeight:'bold',
    fontSize:14,
    alignSelf:'center',
    fontFamily:"DIN-Regular"
  }
})
