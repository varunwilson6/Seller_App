import {StyleSheet,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR,YELLOW_COLOR} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  product:{
    width:120,
    height:120,
    alignSelf:'center',
    marginTop:SCREEN_HEIGHT/8.3
  },
  button:{
    left:SCREEN_HEIGHT/33.3,
    width:SCREEN_WIDTH - SCREEN_HEIGHT/16.6,
    height:44,
    backgroundColor:BUTTON_COLOR,
    position:'absolute',
    bottom:10,
    justifyContent:'center'
  },
  buttonTxt:{
    color:'white',
    fontWeight:'bold',
    fontSize:14,
    alignSelf:'center',
    fontFamily:"DIN-Regular"
  },
	childRoot:{
		width:SCREEN_WIDTH,
		height:Platform.OS == "ios" && (SCREEN_WIDTH == 812 || SCREEN_HEIGHT == 812)?SCREEN_HEIGHT - 170 : SCREEN_HEIGHT - 135,
	},
  cancel:{
    width:18,
    height:18,
    marginTop:20,
    marginLeft:-10
  },
  btnTxt:{
    color:BUTTON_COLOR,
    fontWeight:'bold',
    fontSize:14,
    alignSelf:'center',
    fontFamily:"DIN-Regular"
  },
  text:{
    marginTop:10,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:SCREEN_HEIGHT/50,
    fontFamily:"DIN-Regular"
  }
})
