import {StyleSheet,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderWidth: 0.6,
    borderColor: 'lightgray',
    height:40,
    borderRadius:8,
    marginHorizontal: SCREEN_HEIGHT/50,
    marginTop:SCREEN_HEIGHT/50,
},

ImageStyle: {
    marginTop:Platform.OS=="android"?12.5:1,
    marginLeft:5,
    height: 15,
    width: 15,
  },
  grayDiv:{
    marginTop:SCREEN_HEIGHT/50,
    width:SCREEN_WIDTH,
    height:40,
    backgroundColor:LIGHT_GRAY,
    justifyContent:"center",
    borderWidth:0.6,
    borderColor:"lightgray"
  },
  centerAlign:{
    alignSelf:'center',
    fontSize:14,
    fontFamily:'DIN-Regular',
    color:"gray"
  },
  smallIcons:{
    marginLeft:10,
    marginTop:SCREEN_HEIGHT/100
  },
  minQuantity:{
    marginLeft:SCREEN_HEIGHT/100,
    marginTop:SCREEN_HEIGHT/100,
    fontSize:14,
    color:'gray',
    textAlign:'left',
    fontFamily:"DIN-Regular"
  },
  horzLine:{
    height:0.6,
    backgroundColor:'lightgray',
    width:SCREEN_WIDTH,
    marginLeft:10,
    marginTop:15
  },
  text:{
    marginTop:15,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:10,
    fontFamily:"DIN-Regular"
  },
  buttonTxt:{
    color:'white',
    fontWeight:'bold',
    fontSize:14,
    alignSelf:'center',
    fontFamily:"DIN-Regular"
  },
  button:{
    marginTop:Platform.OS=="android"?0:10,
    marginHorizontal:SCREEN_HEIGHT/50,
    height:44,
    backgroundColor:BUTTON_COLOR,
    justifyContent:'center'
  },
  childRoot:{
    height:Platform.OS == "ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?SCREEN_HEIGHT-160:SCREEN_HEIGHT-130
  },
  product:{
    width:120,
    height:120,
    alignSelf:'center',
    marginTop:SCREEN_HEIGHT/8.3
  },
  swiperImg:{
    height:185,
    width:SCREEN_WIDTH
  },
  swiperContainer:{
    height:200,
  },
  productTitle:{
    marginTop:10,
    fontSize:14,
    color:'black',
    marginLeft:10,
    width:SCREEN_WIDTH-100,
    fontFamily:"DIN-Regular"
  },
  rightAlignText:{
    marginLeft:'auto',
    marginRight:10,
    color:BUTTON_COLOR,
    fontSize:14,
    fontFamily:'DIN-Regular',
    fontWeight:'bold',
    marginTop:10
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
    alignSelf:'center',
    fontFamily:"DIN-Regular"
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
  back:{
    position:'absolute',
    top:Platform.OS=="ios" && (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812)?54:30,
    color:'white',
    fontSize:12,
    left:10,
    fontFamily:"DIN-Regular"
  },
  BackBtn:{
    width:20,
    height:20
  },
category:{
   marginLeft:10,
   marginTop:15,
   width:90,
   height:40,
   borderRadius:4,
   backgroundColor:'#EAEBEC'
},
smallText:{
  marginLeft:5,
  width:80,
  textAlign:'center',
  marginTop:2,
  fontSize:14,
  color:'gray',
 fontFamily:"DIN-Regular"
},
  titlePlaceholders:{
    color:'gray',
    marginTop:15,
    marginLeft:SCREEN_HEIGHT/50,
    fontSize:14,
    alignSelf:'flex-start',
    fontFamily:"DIN-Regular"
  },
  searchContainer:{
    height:40,
    width:SCREEN_WIDTH-120,
    borderRadius:16,
    marginLeft:10,
    marginTop:15,
    backgroundColor:LIGHT_GRAY,
    paddingLeft:15,
    justifyContent:'center'
  },
  name:{
     marginHorizontal:10,
    fontSize:15,
    color:'black',
    marginTop:20,
    fontFamily:"DIN-Regular"
  },
  cardView:{
    marginHorizontal:10,
    backgroundColor:'white',
    marginTop:8,
    borderRadius:0,
    paddingBottom:Platform.OS=="ios"?10:20
  }
})
