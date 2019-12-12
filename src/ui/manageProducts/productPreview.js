import React,{Component} from 'react';
import {View,Text,Image,ScrollView,FlatList,TouchableOpacity,AsyncStorage,WebView,Alert,Vibration,Platform,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Swiper from 'react-native-swiper';
import VideoPlayer from 'react-native-video-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import Lightbox from 'react-native-lightbox';
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
import Stars from 'react-native-stars';
import CardView from 'react-native-cardview'
import Carousel from 'react-native-looped-carousel';
import * as Animatable from 'react-native-animatable';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageZoom from 'react-native-image-pan-zoom';
import call from 'react-native-phone-call'

/*CONSTANTS */
import {APP_COLOR,BUTTON_COLOR,LIGHT_GRAY_TAB,RATING_YELLOW,RATING_GREEN,RATING_RED} from '../../constants/colors';
import {STAR_WHITE,STAR,APP_LOGO} from '../../constants/image';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

/* BrownEagle COMPONENTS */
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';

/* API */
import {getProductWithId} from '../../api/product/getProductWithId'
import {USER} from '../../api/sharedPreferencesKeys'
import {viewProductRatings} from '../../api/product/viewRating'

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

export default class ProductPreview extends Component{

  constructor(props){
    super(props);
    this.concatProductItems = this.concatProductItems.bind(this)
    this.renderCarousel=this.renderCarousel.bind(this)

    this.state={
      productTitle:'',
      loading:true,
      isVisibleStatusAlert:false,
      productPrice:'',
      minQuantity:'',
      companyName:'',
      companyEstablishedYear:'',
      totalEmployees:'',
      companyLocation:'',
      productPictures:[],
      responsePageCount:10,
      pictures:[],
      products:[],
      description:'',
      isDisplaySnackbar:false,
      currency:'',
      productReview:[],
      totalReviewsCount:'',
      avgProductRating:0,
      productVideos:[],
      swiperItems:[],
      sellerDescription:'',
      compare:[],
      isChecked:false,
      compareBtnTitle:i18.addToCompare,
      isViewCompareDisplay:null,
      sellerFirstName:'',
      sellerLastName:'',
      sellerPhoto:'',
      sellerPhotoMarginTop:10,
      sellerPhotoMarginLeft:SCREEN_HEIGHT/50,
      sellerPhotoWidth:40,
      sellerPhotoHeight:40,
      sellerPhotoRadius:20,
      contactPersonName:'',
      contactPersonEmail:'',
      contactPersonPhone:'',
      category:'',
      subCategory:'',
      sellerId:'',
      isSetToFavourite:false,
      isReady:false,
      buyerPhotoMarginTop:10,
      buyerPhotoMarginLeft:SCREEN_HEIGHT/50,
      buyerPhotoWidth:40,
      buyerPhotoHeight:40,
      buyerPhotoRadius:20,
      isFavorite:false,
      favoriteFillColor:'#808080',
      sellerPhotoAlignSelf:'flex-start',
      quickDetails:[],
  }
}

componentWillMount(){
  page=1
  isProductFoundInCompareList=false

  AsyncStorage.getItem("currLang").then((value) => {
    i18.setLanguage(value)
    this.viewProductRatings()
  })

  AsyncStorage.getItem(USER).then((value) => {
      if(value){
        this.setState({
          favoriteFillColor:BUTTON_COLOR
        }, () => {
          var user = JSON.parse(value)
          id=user.user.id
          apiKey=user.auth.key
          this.getProductDetails()
        })
      }
    })
}

  componentWillUnmount(){
    id=""
    page=1
  }

  viewProductRatings(){
    viewProductRatings(this.props.productId,i18.getLanguage()).then((response) => {
      let status = response[0]
      let data = response[1]
      if(data.count>0){
        this.setState({
          productReview:data.productReview.slice(0,3),
          loading:false,
        })
      }
      else{
        this.setState({
          loading:false
        })
      }
    })
  }

getProductDetails(){
  getProductWithId(this.props.productId,apiKey,i18.getLanguage()).then((response) =>{
      if(response.id){
        if(response.quickDetails && response.quickDetails.length>0){
          var quickDetails=[]
          for(var i=0;i<response.quickDetails.length;i++){
              for(key in response.quickDetails[i]){
                var data={label:"",value:""}
                data.label=key
                data.value=response.quickDetails[i][key]
                quickDetails.push(data)
              }
          }
          this.setState({
              quickDetails:quickDetails
            })
        }
        this.setState({
            isReady:true,
            productTitle:response.name,
            productPrice:response.productPrice,
            minQuantity:response.minQuantity,
            companyName:response.seller && response.seller.companyName?response.seller.companyName:"",
            companyEstablishedYear:response.seller && response.seller.established?response.seller.established:"",
            totalEmployees:response.seller && response.seller.employeeCount?response.seller.employeeCount:"",
            companyLocation:response.seller && response.seller.location?response.seller.location:"",
            productPictures:response.productPictures?response.productPictures:[],
            productVideos:response.productVideos?response.productVideos:[],
            description:response.description,
            currency:response.currency,
            totalReviewsCount:response.totalRatingsCount,
            avgProductRating:response.rating,
            sellerDescription:response.seller && response.seller.aboutUs?response.seller.aboutUs:"",
            sellerFirstName:response.seller && response.seller.firstName?response.seller.firstName:"",
            sellerLastName:response.seller && response.seller.lastName?response.seller.lastName:"",
            sellerPhoto:response.seller && response.seller.picture?response.seller.picture:displayPic,
            contactPersonName:response.seller && response.seller.contactPerson && response.seller.contactPerson.name?response.seller.contactPerson.name:"",
            contactPersonEmail:response.seller && response.seller.contactPerson && response.seller.contactPerson.email?response.seller.contactPerson.email:"",
            contactPersonPhone:response.seller && response.seller.contactPerson && response.seller.contactPerson.phone?response.seller.contactPerson.phone:"",
            category:response.category && response.category.name?response.category.name:"",
            subCategory:response.subCategory && response.subCategory.name?response.subCategory.name:"",
            sellerId:response.seller?response.seller.id:"",
          }, () => {
            this.concatProductItems(response.productVideos,response.productPictures)
          })
      }
          else{
            this.setState({
            loading:false,
            isReady:true
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
      {
        this.state.productVideos && this.state.productVideos.length > 0 ? this.state.productVideos.map(i => {
          return(
            <View style={{justifyContent:'center'}}>
              <VideoPlayer style={[STYLES.swiperImg,{alignSelf:'center',height:SCREEN_HEIGHT}]} disableSeek video={{ uri:encodeURI(i.url)}} pauseOnPress/>
            </View>
          )
        }) : []
      }
    </Carousel>
    </ImageZoom>

  )
}

renderVideo(video) {
  return (
    <Lightbox springConfig={{tension: 15, friction: 7}} underlayColor="white" swipeToDismiss={false} renderContent={this.renderCarousel}>
        <VideoPlayer style={STYLES.swiperImg} disableSeek video={{ uri:encodeURI(video.url)}} pauseOnPress/>
    </Lightbox>
  )
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

 showAllReviews(){
  Actions.AllReviews({
    title:i18.allReviewsTitle,
    productId:this.props.productId
  })
 }

 concatProductItems(videos,pictures){
     var productPictures = pictures && pictures.length > 0 ? pictures.map(i => <View key={i.url}>{this.renderAsset(i)}</View>) : <View/>

     var productVideos = videos && videos.length > 0 ? videos.map(i => <View key={i.url}>{this.renderVideo(i)}</View>) : <View/>

     if(pictures.length > 0 && videos.length == 0){
       this.setState({
         swiperItems:productPictures
       })
     }
     if(pictures.length == 0 && videos.length > 0){
       this.setState({
         swiperItems:productVideos
       })
     }
     if(pictures.length > 0 && videos.length > 0){
       this.setState({
         swiperItems:productPictures.concat(productVideos)
       })
     }
 }

renderQuickDetails(item,index){
  if(this.state.quickDetails[index].label || this.state.quickDetails[index].value){
    return(
      <View>
      <View style={{flexDirection:'row'}}>
        <Text style={[STYLES.halfWidthTxt]}>{this.state.quickDetails[index].label} : </Text>
        <Text style={[STYLES.halfWidthTxt,{color:'black'}]}>{this.state.quickDetails[index].value}</Text>
      </View>
      </View>
    )
  }
  else{
    return(
      <View>
        <Text style={[STYLES.title,{color:'gray'}]}>{i18.notAdded}</Text>
      </View>
    )
  }
}

callSupplier(){
if(this.state.contactPersonPhone){
 const args = {
   number: this.state.contactPersonPhone
 }
 call(args).catch(console.error)
}
}
  render(){

    return(
      <View style={{height:SCREEN_HEIGHT-SCREEN_HEIGHT/9.09,backgroundColor:'white'}}>

      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

      <ParallaxScrollView  style={{backgroundColor:'white',display:this.state.isReady?"flex":"none"}}
      parallaxHeaderHeight={250} backgroundColor="white"
      renderForeground={() => (
        <View style={STYLES.swiperContainer}>
          <Swiper key={this.state.swiperItems.length} showsButtons={false} dotColor="white" activeDotColor={BUTTON_COLOR}>
            {this.state.swiperItems && this.state.swiperItems.length > 0?this.state.swiperItems:<FastImage style={STYLES.swiperImg} source={{uri:imagePlaceholder,priority: FastImage.priority.normal,}}
              resizeMode={FastImage.resizeMode.contain}/>}
          </Swiper>
        </View>
      )}
      renderContentBackground={() => (
        <View style={{backgroundColor:'white'}}>

        <Text style={[STYLES.title,{width:SCREEN_WIDTH-SCREEN_HEIGHT/25,marginTop:10,color:'black',fontSize:20,color:BUTTON_COLOR,fontWeight:'bold'}]}>{this.state.productTitle}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.title,{color:'black',marginTop:10,fontSize:18}]}>{this.state.currency} {this.state.productPrice}</Text>
          <Text style={[STYLES.title,{color:'black',alignSelf:'flex-start',display:this.state.minQuantity?"flex":"none",marginRight:SCREEN_HEIGHT/50,fontSize:18,alignSelf:'flex-end',marginLeft:'auto',marginTop:10}]}>{i18.minOrder}: {this.state.minQuantity}</Text>
        </View>
        <Text style={[STYLES.title,{color:'black',alignSelf:'flex-start',display:this.state.category?"flex":"none",fontSize:15,marginTop:10}]}>{i18.category}: {this.state.category}</Text>
        <Text style={[STYLES.title,{color:'black',alignSelf:'flex-start',display:this.state.subCategory?"flex":"none",fontSize:15,marginTop:5}]}>{i18.subCategory}: {this.state.subCategory}</Text>
        <Text style={[STYLES.title,{marginTop:10,color:'gray',fontSize:14}]}>{this.state.description}</Text>

        <View style={[STYLES.grayDiv,{height:8,marginTop:10,display:this.state.quickDetails.length>0?"flex":"none"}]}/>
        <Text style={[STYLES.title,{display:this.state.quickDetails.length>0?"flex":"none"}]}>{i18.quickDetails}</Text>
        <View style={[STYLES.horzLine,{marginLeft:0,marginTop:10,display:this.state.quickDetails.length>0?"flex":"none"}]}/>

        {this.state.quickDetails.length>0 ? this.state.quickDetails.map((i,index) => <View>{this.renderQuickDetails(i,index)}</View>) : null}

          <View style={[STYLES.grayDiv,{height:8,marginTop:10,display:this.state.sellerFirstName?"flex":"none"}]}/>
          <Text style={[STYLES.title,{display:this.state.sellerFirstName?"flex":"none"}]}>{i18.supplierProfile}</Text>
          <View style={[STYLES.horzLine,{marginLeft:0,marginTop:10,display:this.state.sellerFirstName?"flex":"none"}]}/>
            <View style={{flexDirection:'row'}}>
                <FastImage style={{marginTop:this.state.sellerPhotoMarginTop,marginLeft:this.state.sellerPhotoMarginLeft,width:this.state.sellerPhotoWidth,height:this.state.sellerPhotoHeight,borderRadius:this.state.sellerPhotoRadius,alignSelf:this.state.sellerPhotoAlignSelf}} source={{uri:encodeURI(this.state.sellerPhoto),priority: FastImage.priority.normal,}}
                resizeMode={FastImage.resizeMode.stretch}/>
                <View style={{justifyContent:'center'}}>
                  <Text style={[STYLES.title,{width:SCREEN_WIDTH-SCREEN_HEIGHT/25-140,color:'black',display:this.state.sellerFirstName?"flex":"none",alignItems:'center'}]}>{this.state.sellerFirstName} {this.state.sellerLastName}</Text>
                </View>
            </View>
            <Text style={[STYLES.title,{color:'black',marginTop:10,display:this.state.companyName?"flex":"none"}]}>{this.state.companyName}</Text>
            <Text style={[STYLES.title,{color:'black',marginTop:10,display:this.state.companyLocation?"flex":"none"}]}>{this.state.companyLocation}</Text>

            <View style={[STYLES.grayDiv,{marginTop:10,height:8,display:this.state.contactPersonName?"flex":"none"}]}/>
            <Text style={[STYLES.title,{display:this.state.contactPersonName?"flex":"none"}]}>{i18.contactPerson}</Text>
            <View style={[STYLES.horzLine,{marginTop:10,marginLeft:0,display:this.state.contactPersonName?"flex":"none"}]}/>
              <Text style={[STYLES.title,{color:'black',marginTop:10,display:this.state.contactPersonName?"flex":"none"}]}>{this.state.contactPersonName}</Text>
              <Text style={[STYLES.title,{color:'black',marginTop:10,display:this.state.contactPersonEmail?"flex":"none"}]}>{this.state.contactPersonEmail}</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => this.callSupplier()}>
                <Text style={[STYLES.title,{color:'black',marginTop:10,display:this.state.contactPersonPhone?"flex":"none"}]}>{this.state.contactPersonPhone}</Text>
              </TouchableOpacity>

          <View style={{display:!this.state.totalReviewsCount || this.state.totalReviewsCount < 1?"none":"flex"}}>
          <View style={[STYLES.grayDiv,{marginTop:10,height:8}]}/>
          <Text style={[STYLES.title,{color:'black',alignSelf:'flex-start',marginTop:17}]}>{i18.ratingsReviews}</Text>

          <View style={{flexDirection:'row'}}>
            <Text style={STYLES.bigText}>{this.state.avgProductRating.toFixed(1)}</Text>
            <Image source={STAR} style={{width:25,height:25,marginTop:Platform.OS=="ios"?18:19,marginLeft:5}}/>
          </View>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity activeOpacity={1} style={{width:SCREEN_WIDTH}} onPress={() => this.showAllReviews()}>
              <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - SCREEN_HEIGHT/12.5,fontSize:16,marginTop:5}]}>{this.state.totalReviewsCount} {this.state.totalReviewsCount>1?i18.customerReviews:i18.customerReview}</Text>
              <Icon name="chevron-right" size={12} color={APP_COLOR} style={STYLES.rightChevron}/>
            </TouchableOpacity>
          </View>

          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/50,marginTop:15}]}/>
          <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - SCREEN_HEIGHT/25,fontSize:16,marginTop:15}]}>{i18.recentlyAddedReviews}</Text>

          <View>
          <FlatList extraData={this.state} data={this.state.productReview} keyExtractor={(x,i) => i} renderItem={({item}) =>
            <View style={{display:item.rating?"flex":"none"}}>

            <View style={{flexDirection:'row'}}>
              <FastImage style={{marginTop:this.state.buyerPhotoMarginTop,marginLeft:this.state.buyerPhotoMarginLeft,width:this.state.buyerPhotoWidth,height:this.state.buyerPhotoHeight,borderRadius:this.state.buyerPhotoRadius}} source={{uri:encodeURI(item.buyer && item.buyer.picture?item.buyer.picture:displayPic),priority: FastImage.priority.normal,}}
              resizeMode={FastImage.resizeMode.contain}/>
              <View style={{justifyContent:'center'}}>
                <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - 90,fontSize:14,marginTop:15}]}>{item.buyer && item.buyer.firstName?item.buyer.firstName + ' ' +item.buyer.lastName:""}</Text>
              </View>
            </View>

             <View style={{flexDirection:'row'}}>
               <View style={{padding:2,justifyContent:'center',backgroundColor:this.getRatingBackgroundColor(item),width:item.rating%1 !=0?44:32,height:18,marginLeft:SCREEN_HEIGHT/50,marginTop:15,borderRadius:3}}>
                 <View style={{flexDirection:'row'}}>
                  <Text style={STYLES.rating}>{item.rating}</Text>
                  <Image source={STAR_WHITE} style={{width:12,height:12,marginTop:2,marginLeft:2}}/>
                </View>
              </View>
              <Text  style={[STYLES.bigText,{width:SCREEN_WIDTH - SCREEN_HEIGHT/16.6-32,fontSize:14,marginTop:14}]}>{item.title}</Text>
            </View>
            <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - SCREEN_HEIGHT/25,fontSize:14,marginTop:10}]}>{item.comment}</Text>
            <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/50,marginTop:15}]}/>
          </View>
          }/>
          </View>

          </View>

          <View style={{display:!this.state.totalReviewsCount || this.state.totalReviewsCount < 1?"flex":"none"}}>
            <View style={[STYLES.grayDiv,{marginTop:10,height:8}]}/>
            <Text style={[STYLES.bigText,{width:SCREEN_WIDTH - SCREEN_HEIGHT/25,fontSize:14,marginTop:10}]}>{i18.thisProductHasNoReview}</Text>
          </View>

          </View>

      )}>
      </ParallaxScrollView>

      </View>

    )
  }
}
