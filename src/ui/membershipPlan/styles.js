import {StyleSheet,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR,YELLOW_COLOR} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  bigText:{
    marginTop:10,
    marginHorizontal:10,
    fontSize:20,
    fontWeight:'bold',
    fontFamily:"DIN-Regular",
    color:'black'
  },
  cardView:{
    marginHorizontal:10,
    backgroundColor:'white',
    marginTop:8,
    borderRadius:0,
    paddingBottom:Platform.OS=="ios"?10:20
  },
  name:{
    marginTop:10,
    marginLeft:10,
    width:SCREEN_WIDTH-20,
    fontSize:15,
    color:'black',
    fontFamily:'DIN-Regular'
  },
  product:{
    width:120,
    height:120,
    alignSelf:'center',
    marginTop:SCREEN_HEIGHT/8.3
  },
  text:{
    marginTop:SCREEN_HEIGHT/50,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:SCREEN_HEIGHT/50,
    fontFamily:"DIN-Regular"
  },
  rightAlignText:{
    right:10,
    fontSize:18,
    fontFamily:'DIN-Regular',
    top:10,
    position:'absolute'
  },
  textCenter:{
    textAlign:'center',
    marginHorizontal:10,
    marginTop:10,
    fontSize:16,
    fontFamily:'DIN-Regular',
    color:YELLOW_COLOR
  },
  customSubscribe: {
    marginTop:10,
    marginRight:10,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 2,
    backgroundColor:BUTTON_COLOR,
  },
  button:{
    left:SCREEN_HEIGHT/33.3,
    width:SCREEN_WIDTH - SCREEN_HEIGHT/16.6,
    height:44,
    backgroundColor:BUTTON_COLOR,
    position:'absolute',
    bottom:SCREEN_HEIGHT/33.3,
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
		height:Platform.OS == "ios" && (SCREEN_WIDTH == 812 || SCREEN_HEIGHT == 812)?SCREEN_HEIGHT - 180 : SCREEN_HEIGHT - 150,
	},
  grayDiv:{
    backgroundColor:LIGHT_GRAY,
    height:8,
    width:SCREEN_WIDTH,
    marginTop:10
  },
  title:{
  marginHorizontal:SCREEN_HEIGHT/50,
  color:'gray',
  marginTop:SCREEN_HEIGHT/50,
  fontFamily:"DIN-Regular"
},
horzLine:{
  height:0.6,
  backgroundColor:'lightgray',
  width:SCREEN_WIDTH
}
})
