import React,{Component} from 'react'
import {View,Text,Image,ScrollView,TouchableOpacity,Alert,AsyncStorage,TextInput,Platform} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import ImageLoad from 'react-native-image-placeholder';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';
import { TextField } from 'react-native-material-textfield';
import FastImage from 'react-native-fast-image'
import  moment from 'moment';

/*CONSTANTS */
import {BUTTON_COLOR,LIGHT_GRAY,APP_COLOR,LIGHT_GRAY_TAB,RATING_YELLOW,RATING_RED,RATING_GREEN} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

/* BrownEagle COMPONENTS */
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


let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {orderDetails} from '../../api/order/orderDetails'
import {updateOrder} from '../../api/order/updateOrder'

var id=""
var apiKey=""
var imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

export default class OrderDetails extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      status:'',
      companyName:"",
      productPicture:'',
      productName:"",
      currency:"",
      price:"",
      total:'',
      shippingAddress:'',
      orderSubmittedDate:'',
      quantity:'',
      landmark:'',
      buyerName:'',
      isProfileApproved:'',
      contactName:'',
      contactNumber:'',
      commission:'',
      sellerShare:'',
      shippingMethodName:'',
      shippingMethodDeliveryTime: '',
      shippingCharges: '',
      shippingCurrency: '',
      grandTotal: ''
    }
  }

  componentWillMount(){
    this.setState({
      visible:false
    })
    this.getCurrLang()
  }

  getCurrLang(){
      AsyncStorage.getItem("currLang").then((value) => {

      i18.setLanguage(value)
      this.orderDetails()
    })
  }

  orderDetails(){
    orderDetails(this.props.orederId,i18.getLanguage(),this.props.apiKey).then((response) => {
      if(response._id){
        this.setState({
          status:response.status,
          companyName:response.seller?response.seller.companyName:"",
          productPicture:response.product && response.product.productPictures && response.product.productPictures.length > 0?response.product.productPictures[0].url:imagePlaceholder,
          productName:response.product?response.product.name:"",
          currency:response.price?response.price.currency:"",
          price:response.price?response.price.value:"",
          total:response.total,
          quantity:response.quantity,
          shippingAddress:response.shippingAddress?response.shippingAddress.house+', '+response.shippingAddress.street+', '+response.shippingAddress.city+', '+response.shippingAddress.state+', '+response.shippingAddress.country+', '+response.shippingAddress.zipCode:"",
          landmark:response.shippingAddress?response.shippingAddress.Landmark:"",
          orderSubmittedDate:response.createdAt,
          buyerName:response.buyer?response.buyer.firstName:"",
          loading:false,
          isProfileApproved:response.buyer && response.buyer != null?response.buyer.isProfileApproved:"pending",
          contactName:response.shippingAddress && response.shippingAddress != null && response.shippingAddress.contactName?response.shippingAddress.contactName:"Unnamed",
          contactNumber:response.shippingAddress && response.shippingAddress != null?', '+response.shippingAddress.phone:"",
          commission:response.commission?response.commission:"0",
          sellerShare:response.sellerShare?response.sellerShare:"0",
          shippingMethodName: response.shippingMethod && response.shippingMethod.Charges && response.shippingMethod.Charges.Charge && response.shippingMethod.Charges.Charge.length > 0 ? response.shippingMethod.Charges.Charge[0].ChargeType: '',
          shippingMethodDeliveryTime: response.shippingMethod  && response.shippingMethod.DeliveryTime? response.shippingMethod.DeliveryTime: '',
          shippingCharges: response.shippingMethod  && response.shippingMethod.TotalNet ? response.shippingMethod.TotalNet.Amount: '',
          shippingCurrency : response.shippingMethod  && response.shippingMethod.TotalNet ? response.shippingMethod.TotalNet.Currency: '',
          grandTotal : response.grandTotal  && response.grandTotal.value ? response.grandTotal.value+' '+response.grandTotal.currency: '',
        })
      }
      else{
        this.setState({
          loading:false
        })
      }
    })
  }
  componentWillReceiveProps(nextProps){
    this.getCurrLang()
  }

  trackOrder(){
    Actions.TrackOrder({
      title:i18.trackOrderTitle
    })
  }

  getOrderStatus(){
    if(this.state.status == "pending"){
      return i18.waitingForSupplier
    }
    if(this.state.status == "payment_pending"){
      return i18.waitingForPayment
    }
    if(this.state.status == "confirmed"){
      return i18.confirmedd
    }
    if(this.state.status == "shipped"){
      return i18.shipped
    }
    if(this.state.status == "shipping"){
      return i18.orderPlaced
    }
    if(this.state.status == "delivered"){
      return i18.delivered
    }
    if(this.state.status == "rejected"){
      return i18.rejected
    }
    if(this.state.status == "cancelled"){
      return i18.cancelled
    }
    return ""
  }

  isProfileApprovedBackgroundColor(status){
    if(status == 'pending'){
      return RATING_YELLOW
    }
    if(status == 'approved'){
      return '#28C2E1'
    }
    if(status == 'rejected'){
      return RATING_RED
    }
    return RATING_YELLOW
  }

  onChangeOrderStatus(status){
    Alert.alert(
      status=="rejected"?i18.rejectOrder:i18.acceptOrder,
      i18.areYouSure,
    [
  {text:i18.cancel,style:'cancel'},
  {text:i18.yes,onPress: () =>
    this.setState({
      loading:true
    }, () => {
      updateOrder(this.props.orederId,status,i18.getLanguage(),this.props.apiKey).then((response) => {
        if(response.id){
          this.orderDetails()
        }
        else{
          Alert.alert(
            '',
            response.message,
            [{
              text:i18.ok,onPress:() => {
                this.setState({
                  loading:false
                })
              }
            }]
          )
        }
      })
    })
  }
  ],
    {cancelable:false}
    )

  }

  getStatusTextColor(item){
    if(this.state.status == "rejected" || this.state.status == "cancelled"){
      return BUTTON_COLOR
    }
    if(this.state.status == "delivered" || this.state.status == "shipped" || this.state.status == "shipping" || this.state.status == "confirmed"){
      return RATING_GREEN
    }
    return "black"
  }

  openChat(){
    Actions.MessageCenter({
      title:this.state.buyerName
    })
  }

  trackOrder(){
    Actions.TrackOrder({
      title:i18.trackOrderTitle,
      orderId:this.props.orederId,
      sellerId:this.props.sellerId,
      lang:i18.getLanguage(),
      apiKey:this.props.apiKey
    })
  }
  render(){
    return(
      <View style={{height:SCREEN_HEIGHT-SCREEN_HEIGHT/9.09,backgroundColor:'white'}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <ScrollView contentContainerStyle={{paddingBottom:SCREEN_HEIGHT/50,display:this.state.loading?"none":"flex"}}>
        <Text style={STYLES.title}>{i18.productStatus}</Text>
        <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50}]}/>
        <Text style={[STYLES.title,{color:this.getStatusTextColor()}]}>{this.getOrderStatus()}</Text>
        <View style={[STYLES.grayDiv,{height:8,marginTop:SCREEN_HEIGHT/50}]}/>

        <Text style={STYLES.title}>{i18.buyerAndProductInformation}</Text>
        <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50}]}/>
        <View style={{flexDirection:'row'}}>
          <View>
            <Text numberOfLines={1} style={[STYLES.title,{color:'black',width:SCREEN_WIDTH-150,marginTop:SCREEN_HEIGHT/45.45}]}>{this.state.buyerName}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={[STYLES.txt]}>{i18.profileApproval} : </Text>
              <View style={{marginTop:5,backgroundColor:this.isProfileApprovedBackgroundColor(this.state.isProfileApproved),height:18,borderRadius:2,margin:3,paddingLeft:3,paddingRight:3}}>
                <Text style={{fontSize:13,color:'white'}}>{this.state.isProfileApproved}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity activeOpacity={1} style={{backgroundColor:BUTTON_COLOR,width:80,marginLeft:'auto',alignSelf:'flex-end',justifyContent:'center',marginRight:SCREEN_HEIGHT/50,height:35,borderRadius:4}} onPress={() => this.openChat()}>
            <Text style={{color:'white',fontFamily:'DIN-Regular',alignSelf:'center',fontSize:14,fontWeight:'bold',paddingLeft:10,paddingRight:10}}>{i18.chat}</Text>
          </TouchableOpacity>
        </View>
        <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/50}]}/>

        <View style={{flexDirection:'row'}}>
          <FastImage style={[STYLES.trendingImages,{marginLeft:SCREEN_HEIGHT/50}]} source={{uri:encodeURI(this.state.productPicture),priority: FastImage.priority.normal,}}
            resizeMode={FastImage.resizeMode.contain}/>

        <View style={{flexDirection:'column'}}>
          <Text numberOfLines={2} style={[STYLES.name,{marginTop:SCREEN_HEIGHT/50+10,fontWeight:'bold',fontSize:15}]}>{this.state.productName}</Text>
          <Text numberOfLines={2} style={[STYLES.name,{marginTop:10,fontWeight:'bold',fontSize:13}]}>{this.state.currency} {this.state.price} x {this.state.quantity} {i18.unitss}</Text>
        </View>
        </View>
        <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50}]}/>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginLeft:SCREEN_HEIGHT/50}]}>{i18.commission} : </Text>
          <Text style={[STYLES.title,{marginLeft:0,color:'black'}]}>{this.state.currency} {this.state.commission}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginLeft:SCREEN_HEIGHT/50,marginTop:5}]}>{i18.sellerShare} : </Text>
          <Text style={[STYLES.title,{marginLeft:0,color:'black',marginTop:5}]}>{this.state.currency} {this.state.sellerShare}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginLeft:SCREEN_HEIGHT/50,marginTop:5}]}>{i18.listPrice} : </Text>
          <Text style={[STYLES.title,{marginLeft:0,color:'black',marginTop:5}]}>{this.state.currency} {this.state.total}</Text>
        </View>

        <View>
          {
            this.state.shippingCharges ?
            <View style={{flexDirection:'row'}}>
              <Text style={[STYLES.total,{marginLeft:SCREEN_HEIGHT/50,marginTop:5}]}>{i18.shippingCharges} : </Text>
              <Text style={[STYLES.title,{marginLeft:0,color:'black',marginTop:5}]}>{this.state.shippingCharges} {this.state.shippingCurrency}</Text>
            </View>
            :
            null
          }
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginLeft:SCREEN_HEIGHT/50,marginTop:5}]}>{i18.grandTotal} : </Text>
          <Text style={[STYLES.title,{marginLeft:0,color:'black',marginTop:5}]}>{this.state.grandTotal}</Text>
        </View>

        <View style={[STYLES.grayDiv,{height:8,marginTop:SCREEN_HEIGHT/50}]}/>

        <Text style={STYLES.title}>{i18.shippingAddress}</Text>
        <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50}]}/>
        <View style={{flexDirection:'row'}}>
          <Icon style={{marginTop:SCREEN_HEIGHT/50+1,marginLeft:SCREEN_HEIGHT/50}} name="map-marker" size={15} color="gray"/>
          <View style={{flexDirection:'column'}}>
            <Text style={[STYLES.title,{color:'black',marginLeft:5}]}>{this.state.contactName}{this.state.contactNumber}</Text>
            <View>
              <Text style={[STYLES.title,{color:'black',marginTop:5,marginLeft:5}]}>{this.state.shippingAddress}</Text>
              <Text style={[STYLES.title,{color:'black',marginTop:5,marginLeft:5,display:this.state.landmark?"flex":"none"}]}>{i18.landmark} : {this.state.landmark}</Text>
            </View>
          </View>
        </View>

        <View style={{display:this.state.shippingMethodName?"flex":"none"}}>
          <View style={[STYLES.grayDiv,{height:8,marginTop:SCREEN_HEIGHT/50}]}/>
          <Text style={STYLES.title}>{i18.shippingOptions}</Text>
          <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50}]}/>
            <Text style={[STYLES.title, { color: 'black' }]}>{this.state.shippingMethodName}</Text>
            <Text style={[STYLES.title, { marginTop: 5 }]}>{moment(this.state.shippingMethodDeliveryTime).format('LLLL')}</Text>
        </View>

        <View style={[STYLES.grayDiv,{height:8,marginTop:SCREEN_HEIGHT/50}]}/>

        <View style={{flexDirection:'row',justifyContent:'center'}}>
          <Text style={[STYLES.title,{alignSelf:'center'}]}>{i18.orderDetails}</Text>
          <TouchableOpacity activeOpacity={1} style={{backgroundColor:BUTTON_COLOR,width:80,marginLeft:'auto',alignSelf:'flex-end',justifyContent:'center',marginRight:SCREEN_HEIGHT/50,height:35,borderRadius:4,marginTop:SCREEN_HEIGHT/50}} onPress={() => this.trackOrder()}>
            <Text style={{color:'white',fontFamily:'DIN-Regular',alignSelf:'center',fontSize:14,fontWeight:'bold',paddingLeft:10,paddingRight:10}}>{i18.track}</Text>
          </TouchableOpacity>
        </View>
        <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50}]}/>
        <Text style={[STYLES.title,{color:'black'}]}>{i18.orderSubmitted}</Text>
        <Text style={[STYLES.title,{marginTop:SCREEN_HEIGHT/100}]}>{moment(this.state.orderSubmitted).format('LLLL')}</Text>

        </ScrollView>

        <View style={{height:SCREEN_HEIGHT/9.09,backgroundColor:LIGHT_GRAY_TAB,display:this.state.loading?"none":"flex"}}>
            <View style={{flexDirection:'row'}}>
              <View style={[STYLES.touchableOpacityContainer,{marginTop:SCREEN_HEIGHT/50,backgroundColor:BUTTON_COLOR,height:35,width:SCREEN_WIDTH/2-SCREEN_HEIGHT/33.3}]}>
                <TouchableOpacityBtn style={[STYLES.btnTitle,{color:'white',textAlign:'center',fontWeight:'bold',margin:9}]} title={i18.reject} onPress={() => this.onChangeOrderStatus('rejected')}/>
              </View>

              <View style={[STYLES.touchableOpacityContainer,{marginTop:SCREEN_HEIGHT/50,backgroundColor:BUTTON_COLOR,height:35,width:SCREEN_WIDTH/2-SCREEN_HEIGHT/33.3}]}>
                <TouchableOpacityBtn onPress={() => this.trackOrder()} style={[STYLES.btnTitle,{color:'white',textAlign:'center',fontWeight:'bold',margin:9}]} title={i18.accept} onPress={() => this.onChangeOrderStatus('confirmed')}/>
              </View>

           </View>
         </View>

      </View>
    )
  }
}
