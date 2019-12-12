import {StyleSheet,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR,YELLOW_COLOR} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  text:{
    marginTop:10,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:SCREEN_HEIGHT/50,
    fontFamily:"DIN-Regular"
  },
  textfield:{
    marginHorizontal:SCREEN_HEIGHT/33.3,
    marginTop:SCREEN_HEIGHT/50,
    fontSize:14,
    color:'gray',
    fontFamily:"DIN-Regular"
  },
    grayDiv:{
      height:SCREEN_HEIGHT/50,
      marginTop:0,
      backgroundColor:LIGHT_GRAY,
      width:SCREEN_WIDTH
    },
    relativeButton:{
      marginTop:SCREEN_HEIGHT/25,
      marginHorizontal:SCREEN_HEIGHT/50,
      height:44,
      backgroundColor:BUTTON_COLOR,
      justifyContent:'center',
    },
    buttonTxt:{
      color:'white',
      fontWeight:'bold',
      fontSize:14,
      alignSelf:'center',
      fontFamily:"DIN-Regular"
    }
})
