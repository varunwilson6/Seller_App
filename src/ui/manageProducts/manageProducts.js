import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,Platform,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import CardView from 'react-native-cardview'
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';

import LocalizedStrings from 'react-native-localization';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*CONSTANTS */
import {APP_COLOR,BUTTON_COLOR,LIGHT_GRAY_TAB} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {ORDERS,FAVOURITES,ADD,ADD_PRODUCT,WAITING,APPROVED,REJECT} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';

/* API */
import {productCount} from '../../api/product/productCount'
import {USER} from '../../api/sharedPreferencesKeys'

var id=""
var apiKey=""

export default class ManageProducts extends Component{
  constructor(props){
    super(props)
    this.state={
      pending:'0',
      approved:'0',
      rejected:'0',
      all:'0',
      loading:true
    }
  }
  componentWillMount(){
  AsyncStorage.getItem("currLang").then((value) => {
    if(value){
      i18.setLanguage(value)

    }
  })
  AsyncStorage.getItem(USER).then((value) => {
  if(value){
    var user = JSON.parse(value)
    id=user.user.id
    apiKey=user.auth.key
      productCount(id,apiKey).then((response) =>{
        this.setState({
          all:response.total?response.total:"0",
          pending:response.pending?response.pending:"0",
          approved:response.approved?response.approved:"0",
          rejected:response.rejected?response.rejected:"0",
          loading:false
        })
      })
  }
})
}
  addProduct(){
    Actions.AddProduct({
      title:i18.addProductTitle
    })
  }
  allProducts(status){
    switch (status) {
      case "all":
      Actions.AllProducts({
        title:i18.allProductsTitle,
        status:'all'
      })
        break;
      case "pending":
      Actions.AllProducts({
        title:i18.pendingProducts,
        status:'pending'
      })
      break;
      case "rejected":
      Actions.AllProducts({
        title:i18.rejectedProductsTitle,
        status:'rejected'
      })
      break;
      default:
      Actions.AllProducts({
        title:i18.approvedProductsTitle,
        status:'approved'
      })
    }
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:LIGHT_GRAY_TAB}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <View style={{marginTop:SCREEN_HEIGHT/25,height:80}}>
        <Grid>
          <Col>
            <TouchableOpacity activeOpacity={1} onPress={() => this.allProducts("all")}>
            <CardView style={STYLES.cardview} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
              <Image source={ADD_PRODUCT} style={[STYLES.icon,{marginLeft:0}]}/>
              <Text style={[STYLES.text,{fontSize:13,color:'gray',marginTop:5}]}>{i18.allProducts}</Text>
              <Text numberOfLines={1} style={[STYLES.text,{fontSize:16,color:'black',marginTop:0}]}>{this.state.all}</Text>
            </CardView>
            </TouchableOpacity>
          </Col>

          <Col>
            <TouchableOpacity activeOpacity={1} onPress={() => this.allProducts("approved")}>
            <CardView style={STYLES.cardview} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
              <Image source={APPROVED} style={[STYLES.icon,{marginLeft:0}]}/>
              <Text style={[STYLES.text,{fontSize:13,color:'gray',marginTop:SCREEN_HEIGHT/100}]}>{i18.approvedProducts}</Text>
              <Text numberOfLines={1} style={[STYLES.text,{fontSize:16,color:'black',marginTop:0}]}>{this.state.approved}</Text>
            </CardView>
            </TouchableOpacity>
          </Col>
        </Grid>
        </View>

        <View style={{marginTop:Platform.OS=="ios"?SCREEN_HEIGHT/25:SCREEN_HEIGHT/12.5,height:SCREEN_HEIGHT/6.25}}>
        <Grid>
          <Col>
          <TouchableOpacity activeOpacity={1} onPress={() => this.allProducts("pending")}>
            <CardView style={STYLES.cardview} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
              <Image source={WAITING} style={[STYLES.icon,{marginLeft:0}]}/>
              <Text style={[STYLES.text,{fontSize:13,color:'gray',marginTop:SCREEN_HEIGHT/100}]}>{i18.approvalPending}</Text>
              <Text numberOfLines={1} style={[STYLES.text,{fontSize:16,color:'black',marginTop:0}]}>{this.state.pending}</Text>
            </CardView>
          </TouchableOpacity>
          </Col>

          <Col>
          <TouchableOpacity activeOpacity={1} onPress={() => this.allProducts("rejected")}>
            <CardView style={STYLES.cardview} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
              <Image source={REJECT} style={[STYLES.icon,{marginLeft:0}]}/>
              <Text style={[STYLES.text,{fontSize:13,color:'gray',marginTop:SCREEN_HEIGHT/100}]}>{i18.rejectedProducts}</Text>
              <Text numberOfLines={1} style={[STYLES.text,{fontSize:16,color:'black',marginTop:0}]}>{this.state.rejected}</Text>
            </CardView>
          </TouchableOpacity>
          </Col>

        </Grid>
        </View>

         <View style={STYLES.button}>
            <TouchableOpacityBtn onPress={() => this.addProduct()} style={STYLES.buttonTxt} title={i18.addNewProduct}/>
          </View>

      </View>
    )
  }
}
