import React,{Component} from 'react';
import {View,Text,Image,AsyncStorage,Alert,TouchableOpacity,TextInput,ScrollView} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import Swiper from 'react-native-swiper';
import Lightbox from 'react-native-lightbox';
import FastImage from 'react-native-fast-image'
import ImageZoom from 'react-native-image-pan-zoom';
import * as Animatable from 'react-native-animatable';
import Carousel from 'react-native-looped-carousel';

/*CONSTANTS */
import {YELLOW_COLOR,APP_COLOR,LIGHT_GRAY,BUTTON_COLOR} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {SEARCH,APP_LOGO,CANCEL} from '../../constants/image';

/*STYLES */
import {STYLES} from './styles';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

/* API */
import {getRfqById} from '../../api/rfq/getRfqById'
import {USER} from '../../api/sharedPreferencesKeys'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});
var apiKey=""
var imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

export default class RFQDetails extends Component{
  constructor(props){
    super(props);
    this.concatProductItems = this.concatProductItems.bind(this)
    this.renderCarousel=this.renderCarousel.bind(this)

    this.state={
      loading:true,
      title:this.props.updateProductName?this.props.updateProductName:'',
      unitPrice:this.props.unitPrice?this.props.unitPrice:'',
      quantity:this.props.quantity?this.props.quantity:'',
      subCategory:this.props.subCategory?this.props.subCategory:'',
      category:this.props.category?this.props.category:'',
      description:this.props.description?this.props.description:'',
      productPictures:[],
      productId:'',
      swiperItems:[],

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
      this.getRfqDetails()
    }
  })
  }

   getRfqDetails(){
        getRfqById(this.props.rfqId,apiKey,i18.getLanguage()).then((response) =>{
          if(response.id){
            this.setState({
            title:response.title,
            unitPrice:response.preferredUnitPrice?response.preferredUnitPrice.toString():"N/A",
            quantity:response.purchaseQuantity?response.purchaseQuantity.toString():"N/A",
            category:response.category?response.category.name:"N/A",
            subCategory:response.subCategory?response.subCategory.name:"N/A",
            description:response.description?response.description:"N/A",
            productPictures:response.rfqPictures,
            loading:false,
            productId:response.id
          }, () => {
            this.concatProductItems(response.rfqPictures)
          })
          }
          else{
            this.setState({
            loading:false,
          })
          }
        })
  }

  renderAsset(image) {
    return (
      <View style={{backgroundColor:'white'}}>
        <Animatable.View  duration={1500} animation="zoomInUp">
        <Lightbox key={image.url} springConfig={{tension: 20, friction: 5}} underlayColor="white" swipeToDismiss={false} renderContent={this.renderCarousel}>

          <FastImage style={[STYLES.swiperImg]} source={{uri:encodeURI(image.url?image.url:imagePlaceholder),priority: FastImage.priority.normal,}}
            resizeMode={FastImage.resizeMode.contain}/>

          </Lightbox>
          </Animatable.View>
      </View>
    )
  }

concatProductItems(pictures){
     var productPictures = pictures && pictures.length > 0 ? pictures.map(i => <View key={i.url}>{this.renderAsset(i)}</View>) : <View/>

     if(pictures.length > 0){
       this.setState({
         swiperItems:productPictures
       })
     }
 }


renderCarousel(){
  return(
    <ImageZoom  cropWidth={SCREEN_WIDTH} cropHeight={SCREEN_HEIGHT} imageWidth={SCREEN_WIDTH} imageHeight={SCREEN_HEIGHT}>

    <Carousel autoplay={false} bullets chosenBulletStyle={{backgroundColor:BUTTON_COLOR}} bulletStyle={{backgroundColor:'white'}} isLooped={false} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      {
        this.state.productPictures && this.state.productPictures.length > 0 ? this.state.productPictures.map(i => {
          return(
            <View style={{justifyContent:'center'}}>

              <FastImage style={[STYLES.swiperImg,{alignSelf:'center',height:SCREEN_HEIGHT,marginTop:25}]} source={{uri:encodeURI(i.url?i.url:imagePlaceholder),priority: FastImage.priority.normal,}}
                resizeMode={FastImage.resizeMode.contain}/>

            </View>
          )
        }) : []
      }
    </Carousel>
    </ImageZoom>

  )
}


sendQuotations(){
  Actions.SendQuotations({
    title:i18.sendQuotationsTitle,
    productName:this.state.title,
    subCategory:this.state.subCategory,
    category:this.state.category,
    productDescription:this.state.description,
    productId:this.state.productId,
    rfqId:this.props.rfqId,
    quantityRequired:this.state.quantity,
    unitPrice:this.state.unitPrice
  })
}
  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <View style={STYLES.childRoot}>
        <ScrollView>
            <View style={STYLES.swiperContainer}>
            <Swiper key={this.state.swiperItems.length} showsButtons={false} dotColor="white" activeDotColor={BUTTON_COLOR}>
              {this.state.swiperItems && this.state.swiperItems.length > 0?this.state.swiperItems:<FastImage style={STYLES.swiperImg} source={{uri:imagePlaceholder,priority: FastImage.priority.normal,}}
                resizeMode={FastImage.resizeMode.contain}/>}
            </Swiper>
            </View>

          <Text style={[STYLES.text,{fontSize:14,color:'black',textAlign:'left'}]}>{this.state.title}</Text>
          <View style={[STYLES.horzLine,{marginTop:15}]}/>

           <Text numberOfLines={2} style={[STYLES.minQuantity,{marginLeft:10}]}>{i18.quantityRequired}</Text>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:5,textAlign:'left'}]}>{this.state.quantity}</Text>
          <View style={[STYLES.horzLine,{marginTop:15}]}/>

          <Text numberOfLines={2} style={[STYLES.minQuantity,{marginLeft:10}]}>{i18.unitPrice}</Text>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:5,textAlign:'left'}]}>{this.state.unitPrice}</Text>
          <View style={[STYLES.horzLine,{marginTop:15}]}/>

          <Text numberOfLines={2} style={[STYLES.minQuantity,{marginLeft:10}]}>{i18.category}</Text>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:5,textAlign:'left'}]}>{this.state.category}</Text>
          <View style={[STYLES.horzLine,{marginTop:15}]}/>

          <Text numberOfLines={2} style={[STYLES.minQuantity,{marginLeft:10}]}>{i18.subCategory}</Text>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:5,textAlign:'left'}]}>{this.state.subCategory}</Text>
          <View style={[STYLES.horzLine,{marginTop:15}]}/>

          <Text numberOfLines={2} style={[STYLES.minQuantity,{marginLeft:10}]}>{i18.detailedDescription}</Text>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:5,textAlign:'left'}]}>{this.state.description}</Text>
          <View style={[STYLES.horzLine,{marginTop:15}]}/>

        </ScrollView>
        </View>
        <View style={STYLES.button}>
            <TouchableOpacityBtn onPress={() => this.sendQuotations()} style={STYLES.buttonTxt} title={i18.sendQuotationsTitle}/>
        </View>
      </View>
    )
  }
}
