import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,FlatList,Alert,AsyncStorage,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import TermsAndConditionsModal from '../../components/termsAndConditionsModal';

/*CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {PRODUCTS,CATEGORY1,CATEGORY2,CATEGORY3,CATEGORY4,CATEGORY5,CATEGORY6,CATEGORY7,CATEGORY8,CATEGORY9,CATEGORY10,CATEGORY11,CATEGORY12} from '../../constants/image';

/*STYLES */
import {STYLES} from './styles';

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

/* API */
import {getSubcategories} from '../../api/category/getSubcategories'

import {USER} from '../../api/sharedPreferencesKeys'

var page=1
var termsAndConditions=""
var subCategory=""
var subCategoryId=""

export default class ProductSubCategories extends Component{
  constructor(props){
  super(props);
  this.state={
    data:[],
    responsePageCount:10,
    loading:true,
    isResultFound:null,
    bottomLoading:false,
    isCommissionModalOpen:false,
    commission:'',
    isDisplayTermsAndConditions:'flex',
    termsAndConditions:''
  }
}
componentDidMount(){
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
      this.getProductSubcategories()
    }
  })
}

componentWillUnmount(){
    page=1
  }

getProductSubcategories(){
  getSubcategories(apiKey,i18.getLanguage(),page,this.props.categoryId).then((response) =>{
      if(response.count>0){
        this.setState({
            data:[...this.state.data,...response.category[response.category.findIndex(category => category.id === this.props.categoryId)].subCategoryList],
            loading:false,
            responsePageCount:response.pages,
            isResultFound:true,
            bottomLoading:false

          })
      }
          else{
            this.setState({
            loading:false,
            isResultFound:false,
            bottomLoading:false

          })
          }
        })
}
loadMore = () => {
    page=page+1;
    if(this.state.responsePageCount >= page){
      this.setState({bottomLoading:true})

      this.getProductSubcategories()
    }
  }
selectSubCategory(item){
  termsAndConditions=item.termsAndConditions
  subCategory=item.name
  subCategoryId=item.id
  if(this.props.controllerName == "rfq"){
    this.okAction()
    return ;
  }
  this.setState({
    commission:item.commission?item.commission:"0",
    isCommissionModalOpen:true,
  })

}

okAction(){

  if(this.props.controllerName == "rfq"){
  Actions.RFQ({
    category:this.props.title,
    subCategory:subCategory,
    title:i18.productDetails,
    subCategoryId:subCategoryId,
    categoryId:this.props.categoryId
  })
  }
  else{
    Actions.AddProduct({
    category:this.props.title,
    subCategory:subCategory,
    productName:this.props.productName,
    keywords1:this.props.keywords1,
    keywords2:this.props.keywords2,
    keywords3:this.props.keywords3,
    image:this.props.image,
    images:this.props.images,
    minQuantity:this.props.minQuantity,
    productPrice:this.props.productPrice,
    addMoreKeywordDisplay:this.props.addMoreKeywordDisplay,
    keywordsDisplay:this.props.keywordsDisplay,
    description:this.props.description,
    title:i18.productDetails,
    buttonTitle:i18.update,
    productId:this.props.productId,
    controllerName:this.props.controllerName?this.props.controllerName:"",
    subCategoryId:subCategoryId,
    categoryId:this.props.categoryId,
    quickDetailsData:this.props.quickDetailsData,
    weight:this.props.weight,
    width:this.props.width,
    height:this.props.height,
    depth:this.props.depth,
    packageUnits: this.props.packageUnits,
    packageLength: this.props.packageLength,
    packageWidth: this.props.packageWidth,
    packageHeight: this.props.packageHeight,
    packageWeight: this.props.packageWeight,
    termsConditions: this.props.termsConditions
  })
  }
}

cancelAction(){
  this.setState({
    isCommissionModalOpen:false
  })
}
showTermsAndConditions(){
  Actions.CategoryTermsAndConditions({
    title:i18.TCTtile,
    termsAndConditions:termsAndConditions
  })
}
  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
        <Image source={PRODUCTS} style={[STYLES.product,{display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}>{i18.noSubcategoriesFound}</Text>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
        <TermsAndConditionsModal isOpen={this.state.isCommissionModalOpen} commission={this.state.commission} isDisplayTermsAndConditions={this.state.isDisplayTermsAndConditions}
          okAction={() => this.okAction()} cancelAction={() => this.cancelAction()} onPressTermsAndConditions={() => this.showTermsAndConditions()}/>

        <FlatList extraData={this.state} data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5}  data={this.state.data} keyExtractor={(x,i) => i} renderItem={({index,item}) =>

        <TouchableOpacity activeOpacity={1} onPress={() => this.selectSubCategory(item)}>
              <Text style={[STYLES.text,{fontSize:14,width:SCREEN_WIDTH - SCREEN_HEIGHT/33.3-60,marginLeft:10,textAlign:'left',marginHorizontal:0 ,marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{item.name}</Text>
            <View style={[STYLES.horzLine,{height:0.5,marginLeft:10}]}/>
        </TouchableOpacity>
      }/>
      <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

      </View>
    )
  }
}
