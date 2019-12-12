import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,FlatList,Alert,AsyncStorage,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import LocalizedStrings from 'react-native-localization';
import CardView from 'react-native-cardview';
import FastImage from 'react-native-fast-image'
import Stars from 'react-native-stars';

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

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';

/*CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {REJECTED,PRODUCTS} from '../../constants/image';

/*STYLES */
import {STYLES} from './styles';

/* API */
import {allProducts} from '../../api/product/allProducts'
import {USER} from '../../api/sharedPreferencesKeys'
import {listSellerProductsByStatus} from '../../api/product/sellerProductsByStatus'

var id=""
var apiKey=""
var page=1
var imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

export default class ProductCategories extends Component{
  constructor(props){
  super(props);
  this.state={
    data:[],
    loading:true,
    responsePageCount:10,
    isResultFound:null,
    bottomLoading:false,
  }
}
  componentWillMount(){
    page=1
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
      this.getProducts()
    }
  })
  }

  getProducts(){
    if (this.props.status == "all") {
        allProducts(id,apiKey,i18.getLanguage(),page).then((response) =>{
          if(response.count>0){
            this.setState({
            data:[...this.state.data,...response.products],
            loading:false,
            responsePageCount:response.pages,
            isResultFound:true,
            bottomLoading:false,
          })
          }
          else{
            this.setState({
            loading:false,
            isResultFound:false,
            bottomLoading:false,
          })
          }
        })
      }
      else {
        listSellerProductsByStatus(id,this.props.status,apiKey,i18.getLanguage(),page).then((response) =>{
          if(response.count>0){
            this.setState({
            data:[...this.state.data,...response.products],
            loading:false,
            responsePageCount:response.pages,
            isResultFound:true,
            bottomLoading:false,
          })
          }
          else{
            this.setState({
            loading:false,
            isResultFound:false,
            bottomLoading:false,
          })
          }
        })
      }
  }
  productDetails(item){
    Actions.AddProduct({
      buttonTitle:i18.update,
      title:i18.productDetails,
      productId:item.id,
      update:true,
      controllerName:'allProducts'
    })
  }
  addProduct(){
    Actions.AddProduct({
      title:i18.addProductTitle
    })
  }

  loadMore = () => {
    page=page+1;
    if(this.state.responsePageCount >= page){
      this.setState({bottomLoading:true})
      this.getProducts()
    }
  }

  componentWillUnmount(){
    page=1
  }

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
      <Image source={PRODUCTS} style={[STYLES.product,{display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}/>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}>{i18.noProductsFound}</Text>

        <FlatList extraData={this.state} data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>

        <TouchableOpacity activeOpacity={1} onPress={() => this.productDetails(item)}>
        <CardView cardElevation={2} style={[STYLES.card,{marginTop:5}]} cardMaxElevation={2} cornerRadius={5}>
          <View style={{flexDirection:'row'}}>
            <FastImage style={STYLES.trendingImages} source={{uri:encodeURI(item.productPictures && item.productPictures != undefined && item.productPictures.length>0?item.productPictures[0].url:imagePlaceholder),priority: FastImage.priority.normal,}}
              resizeMode={FastImage.resizeMode.contain}/>

          <View style={{flexDirection:'column'}}>
            <Text numberOfLines={2} style={[STYLES.productTitle,{marginTop:8,fontWeight:'bold',fontSize:15}]}>{item.name}</Text>

            <Text numberOfLines={1} style={[STYLES.productTitle,{color:'gray',marginTop:4,fontSize:12,display:item.seller && item.seller.companyName?"flex":"none"}]}>{i18.by} {item.seller?item.seller.companyName:""}</Text>
            <Text numberOfLines={1} style={[STYLES.productTitle,{marginTop:4,fontSize:12}]}>{item.seller?item.seller.location:""}</Text>

            <View style={{flexDirection:'row'}}>
                <Text numberOfLines={1} style={{marginTop:4,fontSize:13,color:'gray',fontFamily:'DIN-Regular',marginTop:4,marginLeft:10}}>PPU: </Text>
                <Text numberOfLines={1} style={[STYLES.productTitle,{marginTop:2,marginLeft:0,fontSize:16,width:SCREEN_WIDTH-165}]}>{item.currency} {item.productPrice}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text numberOfLines={1} style={{marginTop:4,fontSize:13,color:'gray',fontFamily:'DIN-Regular',marginTop:4,marginLeft:10}}>{i18.minOrder}: </Text>
                <Text numberOfLines={1} style={[STYLES.productTitle,{marginTop:4,marginLeft:0,width:SCREEN_WIDTH-200}]}>{item.minQuantity} {item.minQuantity>1?i18.pieces:i18.piece}</Text>
            </View>
            <View style={{marginLeft:10,marginTop:4,flexDirection:'row'}}>
              <Stars disabled starSize={12} rating={item.rating} count={5} half={true}/>
              <Text numberOfLines={2} style={[STYLES.productTitle,{fontSize:12,color:'gray',marginLeft:5,marginTop:0,width:SCREEN_WIDTH-200}]}>({item.totalRatingsCount})</Text>
            </View>
            <Text numberOfLines={2} style={[STYLES.productDscrp]}>{item.description}</Text>
            </View>
          </View>

        </CardView>
        </TouchableOpacity>
      }/>
      <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

      </View>
    )
  }
}
