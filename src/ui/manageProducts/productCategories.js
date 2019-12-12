import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,Alert,AsyncStorage,FlatList,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import LocalizedStrings from 'react-native-localization';
import { TextField } from 'react-native-material-textfield';
import TermsAndConditionsModal from '../../components/termsAndConditionsModal';

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
import {APP_COLOR,LIGHT_GRAY_TAB} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CATEGORY,PRODUCTS,CATEGORY1,CATEGORY2,CATEGORY3,CATEGORY4,CATEGORY5,CATEGORY6,CATEGORY7,CATEGORY8,CATEGORY9,CATEGORY10,CATEGORY11,CATEGORY12} from '../../constants/image';

/*STYLES */
import {STYLES} from './styles';

/* API */
import {getCategories} from '../../api/category/getCategories'
import {USER} from '../../api/sharedPreferencesKeys'

var id=""
var apiKey=""
var page=1
var name=""
var categoryId=""
var _index=""
var termsAndConditions=""

export default class ProductCategories extends Component{
  constructor(props){
  super(props);
  this.state={
    loading:true,
    responsePageCount:10,
    data:[],
    subCategoryList:[],
    isResultFound:null,
    isCommissionModalOpen:false,
    commission:'',
    isDisplayTermsAndConditions:'flex',
    bottomLoading:false
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
      this.getProductCategories()
    }
  })
}

componentWillUnmount(){
  page=1
}

getProductCategories(){
   getCategories(apiKey,i18.getLanguage(),page).then((response) =>{
          if(response.count>0){
           this.setState({
            data:[...this.state.data,...response.category],
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

      this.getProductCategories()
    }
  }
openSubCategories(item,index){
    name=item.name
    categoryId=item.id
    _index=index
    name=item.name
    categoryId=item.id
    _index=index
    if(this.props.controllerName == "rfq"){
      this.okAction()
      return ;
    }
    termsAndConditions=item.termsAndConditions
      this.setState({
        commission:item.commission?item.commission:"0",
        isCommissionModalOpen:true
      })
  }

  okAction(){
    if(this.state.data[_index].subCategoryList.length > 0){
      Actions.ProductSubCategories({
      title:name,
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
      productId:this.props.productId,
      controllerName:this.props.controllerName?this.props.controllerName:"",
      categoryId:categoryId,
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
    else if(this.state.data[_index].subCategoryList.length == 0 && this.props.controllerName == "rfq"){
      Actions.RFQ({
        category:name,
        categoryId:categoryId
      })
    }
    else{
      Actions.AddProduct({
      title:name,
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
      productId:this.props.productId,
      controllerName:this.props.controllerName?this.props.controllerName:"",
      categoryId:categoryId,
      quickDetailsData:this.props.quickDetailsData,
      category:name,
      buttonTitle:i18.update,
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
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
        <TermsAndConditionsModal isOpen={this.state.isCommissionModalOpen} commission={this.state.commission} isDisplayTermsAndConditions={this.state.isDisplayTermsAndConditions}
          okAction={() => this.okAction()} cancelAction={() => this.cancelAction()} onPressTermsAndConditions={() => this.showTermsAndConditions()}/>
        <Image source={PRODUCTS} style={[STYLES.product,{display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}>{i18.noCategoriesFound}</Text>

        <FlatList extraData={this.state} data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5}  data={this.state.data} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
           <TouchableOpacity activeOpacity={1} onPress={() => this.openSubCategories(item,index)}>
              <View style={{flexDirection:'row'}}>
                <Text style={[STYLES.text,{fontSize:14,width:SCREEN_WIDTH - SCREEN_HEIGHT/33.3-60,marginLeft:10,textAlign:'left',marginHorizontal:0 ,marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{item.name}</Text>
                <Icon name="chevron-right" size={12} color="gray" style={[STYLES.rightArrow,{display:item.subCategoryList.length > 0?"flex":"none"}]}/>
              </View>
              <View style={[STYLES.horzLine,{height:0.5,marginLeft:10}]}/>
            </TouchableOpacity>
        }/>
        <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

      </View>
    )
  }
}
