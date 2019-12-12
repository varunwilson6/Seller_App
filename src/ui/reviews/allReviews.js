import React,{Component} from 'react';
import {View,Text,Image,ScrollView,AsyncStorage,Alert,TouchableOpacity,FlatList,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Swiper from 'react-native-swiper';
import ImageLoad from 'react-native-image-placeholder';
import CardView from 'react-native-cardview'
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';
import RippleButton from '../../components/button';
import FastImage from 'react-native-fast-image'
import Stars from 'react-native-stars';
import Lightbox from 'react-native-lightbox';

/*CONSTANTS */
import {RATING_GREEN,RATING_RED,RATING_YELLOW,BUTTON_COLOR,LIGHT_GRAY,APP_COLOR} from '../../constants/colors';
import {STAR_WHITE} from '../../constants/image';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

/* BrownEagle COMPONENTS */
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';
import {USER} from '../../api/sharedPreferencesKeys'

/* API */
import {allProductRatingsPaginate} from '../../api/product/viewRating'

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

var page=1
var id=""
var apiKey=""
var perPage=7
var imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"
var displayPic="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"

export default class AllReviews extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      responsePageCount:10,
      reviews:[],
      avatarMarginTop:10,
      avatarMarginLeft:10,
      avatarWidth:40,
      avatarHeight:40,
      avatarRadius:20,
      bottomLoading:false
    }
  }
  componentWillMount(){
      page=1

      AsyncStorage.getItem(USER).then((value) => {
      if(value){
        var user = JSON.parse(value)
        id=user.user.id
        apiKey=user.auth.key
      }
    })
     this.getCurrLang()
  }

  loadMore = () => {
    page=page+1;
    if(this.state.responsePageCount >= page){
      this.setState({bottomLoading:true})
      this.allProductRatingsPaginate()
    }
  }

  componentWillUnmount(){
    page=1
  }

allProductRatingsPaginate(){
  allProductRatingsPaginate(this.props.productId,i18.getLanguage(),page,perPage).then((response) =>{
      if(response.productReview){
        this.setState({
            loading:false,
            responsePageCount:response.pages,
            reviews:[...this.state.reviews,...response.productReview],
            bottomLoading:false
          })
      }
          else{
            this.setState({
            loading:false,
            bottomLoading:false

          })
          }
        })
}

getCurrLang(){
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.allProductRatingsPaginate()

    })
  }

getRatingBackgroundColor(item){
  if(item.rating >= 4){
    return RATING_GREEN
  }
  if(item.rating >= 2){
    return RATING_YELLOW
  }
  return RATING_RED
 }

render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>

      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <FlatList extraData={this.state} data={this.state.reviews} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
          <CardView style={[STYLES.cardView,{display:item.rating?"flex":"none"}]} cardElevation={2} cardMaxElevation={2} cornerRadius={0}>
              <View style={{flexDirection:'row'}}>
                <FastImage style={{marginTop:this.state.avatarMarginTop,marginLeft:this.state.avatarMarginLeft,width:this.state.avatarWidth,height:this.state.avatarHeight,borderRadius:this.state.avatarRadius}} source={{uri:encodeURI(item.buyer && item.buyer.picture?item.buyer.picture:displayPic),priority: FastImage.priority.normal,}}
                resizeMode={FastImage.resizeMode.contain}/>
                <View style={{justifyContent:'center'}}>
                  <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - 90,fontSize:14,marginTop:14}]}>{item.buyer && item.buyer.firstName?item.buyer.firstName + ' ' +item.buyer.lastName:""}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row'}}>
                <View style={{padding:2,justifyContent:'center',backgroundColor:this.getRatingBackgroundColor(item),width:item.rating%1 !=0?44:32,height:18,marginLeft:10,marginTop:15,borderRadius:3}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={STYLES.rating}>{item.rating}</Text>
                    <Image source={STAR_WHITE} style={{width:12,height:12,marginTop:2,marginLeft:2}}/>
                  </View>
                </View>
                <Text  style={[STYLES.bigText,{width:SCREEN_WIDTH - 80,fontSize:14,marginTop:14}]}>{item.title}</Text>
              </View>
              <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - 40,fontSize:14,marginTop:10}]}>{item.comment}</Text>

            </CardView>
         }/>
         <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />


      </View>
    )
  }
}
