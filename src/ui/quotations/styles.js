import {StyleSheet,PixelRatio,Platform} from 'react-native';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {BUTTON_COLOR,APP_COLOR,LIGHT_GRAY,FACEBOOK_HEX} from '../../constants/colors'

export const STYLES=StyleSheet.create({
  title:{
    marginHorizontal:10,
    color:'black',
    marginTop:10,
    fontFamily:"DIN-Regular",
    fontSize:14
  },
  horzLine:{
    height:0.6,
    backgroundColor:'lightgray',
    width:SCREEN_WIDTH
  },
  textInput:{
    marginTop:10,
    marginHorizontal:10,
    color:'black',
    fontFamily:"DIN-Regular",
  },
  description:{
    marginHorizontal:10,
    height:100,
  },
  attach:{
    marginLeft:10,
    marginTop:10,
    width:40,
    height:40,
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
  },
  cancel:{
    width:18,
    height:18,
    marginLeft:11
  },
  text:{
    marginTop:15,
    color:'black',
    textAlign:'center',
    fontSize:14,
    marginHorizontal:10,
    fontFamily:"DIN-Regular"
  },
  minQuantity:{
    marginLeft:SCREEN_HEIGHT/100,
    marginTop:5,
    fontSize:14,
    color:'gray',
    textAlign:'left',
    fontFamily:"DIN-Regular"
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderWidth: 0.6,
    borderColor: 'lightgray',
    height:40,
    borderRadius:8,
    marginHorizontal: 10,
    marginTop:10,
},
  ImageStyle: {
    margin: 7.55,
    height: 15,
    width: 15,
    resizeMode : 'stretch',
    alignItems: 'center'
  },
  smallIcons:{
    marginLeft:10,
    marginTop:5
  },
  grayDiv:{
    marginTop:10,
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
  dropdown:{
    marginTop:10,
    marginLeft:10,
    borderWidth:0.6,
    borderColor:'lightgray',
    padding:8,
    width:100,
    borderRadius:4,
  },
  status:{
    marginLeft:10,
    marginTop:15,
    fontSize:14,
    color:'gray',
    fontFamily:'DIN-Regular'
  },
  halfLine:{
    marginTop:8,
    marginLeft:10,
    height:0.6,
    backgroundColor:'lightgray',
    width:SCREEN_WIDTH/2-15
  },
  product:{
    width:120,
    height:120,
    alignSelf:'center',
    marginTop:SCREEN_HEIGHT/8.3
  },
  cardView:{
    marginHorizontal:10,
    backgroundColor:'white',
    marginTop:8,
    borderRadius:0,
    paddingBottom:Platform.OS=="ios"?10:20
  },
  swiperImg:{
    height:185,
    width:SCREEN_WIDTH
  },
  swiperContainer:{
    height:200,
  }
})
