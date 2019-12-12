import {StyleSheet,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  topSearchNav:{
    backgroundColor:APP_COLOR,
    height:Platform.OS=="ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?88:64,
    justifyContent:'center',
    width:SCREEN_WIDTH
  },
  horzLine:{
    height:0.6,
    backgroundColor:'lightgray',
    width:SCREEN_WIDTH
  },
  navTitle:{
    marginHorizontal:10,
    color:'white',
    marginTop:Platform.OS=="ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?44:20,
    fontSize:16,
    alignSelf:'center',
    fontFamily:"DIN-Regular"
  },
  profileContainer:{
    height:SCREEN_HEIGHT/4.16,
    backgroundColor:LIGHT_GRAY,
    width:SCREEN_WIDTH
  },
  profile:{
    width:SCREEN_HEIGHT/8.34,
    height:SCREEN_HEIGHT/8.34,
    alignSelf:'center',
    marginTop:SCREEN_HEIGHT/25,
    borderRadius:SCREEN_HEIGHT/16.60
  },
  text:{
   marginTop:SCREEN_HEIGHT/50,
    color:'black',
    textAlign:'center',
    fontSize:16,
    marginHorizontal:SCREEN_HEIGHT/50,
    fontFamily:"DIN-Regular"
  },
  icon:{
    marginTop:SCREEN_HEIGHT/33.3,
    width:22,
    height:22,
    marginLeft:SCREEN_HEIGHT/33.3,
    alignSelf:'center'
  },
  vertLine:{
    height:80,
    width:0.6,
    backgroundColor:'lightgray'
  },
  grayDiv:{
    backgroundColor:LIGHT_GRAY,
    height:8,
    width:SCREEN_WIDTH
  },
  logout:{
     position:'absolute',
    top:Platform.OS=="ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?54:30,
    color:'white',
    fontSize:12,
    paddingRight:10,
    alignSelf:'flex-end',
    fontFamily:"DIN-Regular"
    
  },
  name:{
    fontSize:14,
    color:'gray',
    textAlign:'center',
    marginTop:5,
    fontFamily:"DIN-Regular"
  },
  verified:{
    width:15,
    height:15,
    marginTop:10,
    marginLeft:5
  }
})
