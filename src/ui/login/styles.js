import {StyleSheet,PixelRatio} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {BUTTON_COLOR,APP_COLOR,LIGHT_GRAY} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  absoluteButton:{
    left:SCREEN_HEIGHT/25,
    width:SCREEN_WIDTH-SCREEN_HEIGHT/12.5,
    height:44,
    backgroundColor:BUTTON_COLOR,
    marginTop:SCREEN_HEIGHT/25,
    position:'absolute',
    bottom:110,
    justifyContent:'center'
  },
  button:{
    marginHorizontal:SCREEN_HEIGHT/25,
    height:44,
    backgroundColor:BUTTON_COLOR,
    marginTop:SCREEN_HEIGHT/25,
    justifyContent:'center'
  },
  loginContainer:{
    height:SCREEN_HEIGHT/12.5+120,
    marginHorizontal:SCREEN_HEIGHT/25,
    backgroundColor:'white',
    marginTop:SCREEN_HEIGHT/16.6,
  },
  signupContainer:{
    height:SCREEN_HEIGHT/1.56,
    marginHorizontal:SCREEN_HEIGHT/25,
    backgroundColor:'white',
    marginTop:SCREEN_HEIGHT/16.6,
  },
  verifyOtpContainer:{
    height:SCREEN_HEIGHT/3.57,
    marginHorizontal:SCREEN_HEIGHT/25,
    backgroundColor:'white',
    marginTop:SCREEN_HEIGHT/16.6,
  },
  text:{
    color:BUTTON_COLOR,
    textAlign:'center',
    fontSize:16,
    marginTop:SCREEN_HEIGHT/25,
    fontFamily:"DIN-Regular"
  },
  appLogo:{
    top:SCREEN_HEIGHT/5,
    width:200,
    height:50,
    alignSelf:'center',
    position:'absolute'
  },
  touchableOpacity:{
    color:BUTTON_COLOR,
    textAlign:'center',
    fontWeight:'bold',
    backgroundColor:'transparent',
    marginTop:SCREEN_HEIGHT/25,
    fontFamily:"DIN-Regular"
  },
  logo:{
    marginTop:SCREEN_HEIGHT/25,
     width:200,
     height:50,
     alignSelf:'center',
  },
  textField:{
    marginTop:SCREEN_HEIGHT/50,
    marginHorizontal:SCREEN_HEIGHT/50,
    height:40,
    borderWidth:1,
    fontSize:14,
    borderColor:'lightgray',
    padding: SCREEN_HEIGHT/50,
    backgroundColor:LIGHT_GRAY,
    fontFamily:"DIN-Regular"
  },
  container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 },
 welcome: {
   fontSize: 20,
   textAlign: 'center',
   margin: 10
 },
 instructions: {
   fontSize: 12,
   textAlign: 'center',
   color: '#888',
   marginTop: 5,
   backgroundColor: 'transparent',
    fontFamily:"DIN-Regular"
 },
 data: {
   padding: 15,
   marginTop: 10,
   backgroundColor: '#ddd',
   borderColor: '#888',
   borderWidth: 1 / PixelRatio.get(),
   color: '#777',
    fontFamily:"DIN-Regular"
 },
 language:{
   fontSize:14,
   color:'black',
   marginRight:SCREEN_HEIGHT/50,
   alignSelf:'flex-end',
   marginLeft:'auto',
   marginTop:SCREEN_HEIGHT/166.67,
    fontFamily:"DIN-Regular"
 },
 txtFieldContainer:{
  height:44,
   borderWidth:1,
   fontSize:14,
   borderColor:'lightgray',
   backgroundColor:'white',
   marginHorizontal:SCREEN_HEIGHT/25,
   marginTop:SCREEN_HEIGHT/16.6,
   justifyContent:'center'
 },
  rowTxt:{
    color:'white',
    fontSize:14,
    marginTop:SCREEN_HEIGHT/12.5,
    marginLeft:SCREEN_HEIGHT/50,
    fontFamily:"DIN-Regular"
  },
  buttonTxt:{
    color:'black',
    fontWeight:'bold',
    fontSize:14,
    alignSelf:'center',
    fontFamily:"DIN-Regular",
  }
})
