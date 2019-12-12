import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,Alert,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";

/*CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

/*STYLES */
import {STYLES} from './styles';

export default class ProductDetails extends Component{

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>

      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/33.3,fontSize:14,fontWeight:'bold',textAlign:'left'}]}>Basic Information</Text>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,fontSize:14,textAlign:'left',color:'gray'}]}>{this.props.product?this.props.product.name:""}</Text>
      <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/33.3}]}/>

      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/33.3,fontSize:14,fontWeight:'bold',textAlign:'left'}]}>Category Information</Text>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,fontSize:14,textAlign:'left',color:'gray'}]}>{this.props.product?this.props.product.category:""}</Text>
      <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/33.3}]}/>

      <View style={{flexDirection:'row'}}>
        <Icon name="shopping-cart" color="gray" size={15} style={[STYLES.smallIcons,{marginTop:SCREEN_HEIGHT/33.3}]}/>
        <Text numberOfLines={2} style={[STYLES.minQuantity,{marginTop:SCREEN_HEIGHT/33.3}]}>{this.props.product?this.props.product.minQuantity:""} quantities</Text>
        <Icon name="money" color="gray" size={15} style={[STYLES.smallIcons,{marginTop:SCREEN_HEIGHT/33.3}]}/>
        <Text numberOfLines={2} style={[STYLES.minQuantity,{marginTop:SCREEN_HEIGHT/33.3}]}>{this.props.product?this.props.product.productPrice:""}</Text>
      </View>
      <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/33.3}]}/>

      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/33.3,fontSize:14,fontWeight:'bold',textAlign:'left'}]}>Detailed Description</Text>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,fontSize:14,textAlign:'left',color:'gray'}]}>{this.props.product?this.props.product.description:""}</Text>
      <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/33.3}]}/>

      </View>
    )
  }
}
