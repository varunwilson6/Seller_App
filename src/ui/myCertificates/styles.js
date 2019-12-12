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
  text:{
    marginTop:10,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:SCREEN_HEIGHT/50,
    fontFamily:"DIN-Regular"
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
  pdf:{
    width:150,
    height:200,
    alignSelf:'center',
    marginTop:30
  },
	childRoot:{
		width:SCREEN_WIDTH,
		height:Platform.OS == "ios" && (SCREEN_WIDTH == 812 || SCREEN_HEIGHT == 812)?SCREEN_HEIGHT - 180 : SCREEN_HEIGHT - 150,
	},
  cancel:{
    width:18,
    height:18,
    marginLeft:11
  },
  btnTxt:{
    color:BUTTON_COLOR,
    fontWeight:'bold',
    fontSize:14,
    alignSelf:'center',
    fontFamily:"DIN-Regular"
  },
  title:{
    marginTop:10,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:20,
    fontFamily:"DIN-Regular"
  }
})
