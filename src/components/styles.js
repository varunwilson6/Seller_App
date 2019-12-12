import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../constants/common';
import {LIGHT_GRAY,APP_COLOR} from '../constants/colors';

export const STYLES = StyleSheet.create({
  icon:{
    marginTop:7,
    marginLeft:10,
    backgroundColor:'transparent',
  },
  textField:{
    marginTop:SCREEN_HEIGHT/50,
    marginHorizontal:SCREEN_HEIGHT/25,
    height:44,
    borderWidth:1,
    fontSize:14,
    borderColor:'lightgray',
    paddingLeft: SCREEN_HEIGHT/50,
    backgroundColor:LIGHT_GRAY,
    fontFamily:"DIN-Regular"
  },
  navBar:{
    width:SCREEN_WIDTH,
    backgroundColor:APP_COLOR,
    height:64
  },
  alertText:{
    marginTop:SCREEN_HEIGHT/33.3,
    textAlign:'center',
    marginHorizontal:SCREEN_HEIGHT/25,
    fontSize:16,
    height:40,
    color:'black',
    fontFamily:"DIN-Regular"
  },
  btnTxt:{
    fontSize:16,
    color:"white",
    flex:1,
    fontWeight:'bold',
    backgroundColor:'transparent',
    fontFamily:"DIN-Bold"
  },
  button:{
    width:SCREEN_WIDTH-SCREEN_HEIGHT/12.5,
    height:44,
    backgroundColor:APP_COLOR,
    marginTop:SCREEN_HEIGHT/16.6,
  },
  container:{
    width:SCREEN_WIDTH-SCREEN_HEIGHT/12.5,
    height:127,
  },
  navLogo:{
    height:30,
    width:30
  }
});
