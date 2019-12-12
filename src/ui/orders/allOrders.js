import React,{Component} from 'react'
import {View,Text,Image,ScrollView,TouchableOpacity,Alert,AsyncStorage,ActivityIndicator,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import CardView from 'react-native-cardview';
import ImageLoad from 'react-native-image-placeholder';
import { Dropdown } from 'react-native-material-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'

/*CONSTANTS */
import {BUTTON_COLOR,LIGHT_GRAY,APP_COLOR,RATING_GREEN} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {REJECTED,PRODUCTS} from '../../constants/image';

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

/*API */
import {allOrders} from '../../api/order/allOrders';
import {USER} from '../../api/sharedPreferencesKeys'

var id=""
var apiKey=""
var page=1
var imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

export default class AllOrders extends Component{
  constructor(props){
    super(props)
    this.state={
      loading:true,
      responsePageCount:10,
      bottomLoading:false,
      data:[],
      status:'',
      isResultFound:null,
      paymentWaiting:false
    }
  }

  componentWillMount(){
      page=1
      this.allOrders()

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
      this.allOrders()
    }
  }

  componentWillUnmount(){
    page=1
  }

allOrders(){
    allOrders(this.props.id,page,i18.getLanguage(),this.state.status).then((response) =>{
      if(response.count>0){
        this.setState({
            loading:false,
            responsePageCount:response.pages,
            bottomLoading:false,
            data:[...this.state.data,...response.order],
            isResultFound:true
          })
      }
          else{
            this.setState({
            loading:false,
            bottomLoading:false,
            isResultFound:false
          })
          }
    })
}

    getCurrLang(){
      AsyncStorage.getItem("currLang").then((value) => {

      i18.setLanguage(value)
      this.setState({
        visible:false
      })
    })
    }
  componentWillReceiveProps(nextProps){
    this.getCurrLang()
  }

showOrderDetails(item){
    Actions.OrderDetails({
      title:i18.orderDetailsTitle,
      orederId:item.id,
      apiKey:apiKey,
      sellerId:id
    })
}

getStatus(status){
  if(status == "pending"){
    return i18.waitingForSupplier
  }
  if(status == "payment_pending"){
    return i18.waitingForPayment
  }
  if(status == "confirmed"){
    return i18.confirmedd
  }
  if(status == "shipped"){
    return i18.shipped
  }
  if(status == "shipping"){
    return i18.orderPlaced
  }
  if(status == "delivered"){
    return i18.delivered
  }
  if(status == "rejected"){
    return i18.rejected
  }
  if(status == "cancelled"){
    return i18.cancelled
  }
  return ""
}

onChangeStatus(status){
      page=1
    switch (status) {
      case i18.allOrders:
        this.setState({
          status:null,
          loading:true,
          data:[]
        },() => {
          this.allOrders()
        })
        break;
      case i18.waitingForOrderConfirmation:
        this.setState({
          status:'pending',
          loading:true,
          data:[]
        },() => {
          this.allOrders()
        })
        break;
      case i18.waitingForPayment:
        this.setState({
          status:'payment_pending',
          loading:true,
          data:[]
        },() => {
          this.allOrders()
        })
        break;
        case i18.confirmed:
          this.setState({
            status:'confirmed',
            loading:true,
            data:[]
          },() => {
            this.allOrders()
          })
          break;
          case i18.shippedOrders:
            this.setState({
              status:'shipped',
              loading:true,
              data:[]
            },() => {
              this.allOrders()
            })
            break;
            case i18.shippingOrders:
              this.setState({
                status:'shipping',
                loading:true,
                data:[]
              },() => {
                this.allOrders()
              })
              break;
            case i18.deliveredOrders:
              this.setState({
                status:'delivered',
                loading:true,
                data:[]
              },() => {
                this.allOrders()
              })
              break;
              case i18.rejectedOrders:
                this.setState({
                  status:'rejected',
                  loading:true,
                  data:[]
                },() => {
                  this.allOrders()
                })
                break;
      default:
        this.setState({
          status:'cancelled',
          loading:true,
          data:[]
        },() => {
          this.allOrders()
        })
    }
  }

  getStatusTextColor(item){
    if(item.status == "rejected" || item.status == "cancelled"){
      return BUTTON_COLOR
    }
    if(item.status == "delivered" || item.status == "shipped" || item.status == "shipping" || item.status == "confirmed"){
      return RATING_GREEN
    }
    return "gray"
  }
  render(){
    let orderStatus = [{
      value: i18.allOrders,
    }, {
      value: i18.waitingForOrderConfirmation,
    },{
       value: i18.waitingForPayment,
    },{
       value: i18.confirmed,
    },{
       value: i18.shippedOrders
    },{
       value: i18.shippingOrders
    },{
       value: i18.deliveredOrders
    },{
       value: i18.rejectedOrders
    },{
       value: i18.cancelledOrders
    }];
    return(
      <View style={{flex:1,backgroundColor:'white',paddingBottom:20}}>

      <View style={{marginHorizontal:SCREEN_HEIGHT/50}}>
        <Dropdown dropdownPosition={0} fontSize={14} value={i18.allOrders} data={orderStatus} onChangeText={(data) => this.onChangeStatus(data)}/>
      </View>

      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
      <Image source={PRODUCTS} style={[STYLES.product,{display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}/>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.loading || this.state.isResultFound == true?"none":"flex",textAlign:'center'}]}>{i18.noOrdersFound}</Text>

      <FlatList data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
      <CardView cardElevation={2} style={[STYLES.card,{marginTop:5}]} cardMaxElevation={2} cornerRadius={5}>
      <TouchableOpacity onPress={() => this.showOrderDetails(item)} activeOpacity={1}>
        <View style={{flexDirection:'row'}}>
          <FastImage style={STYLES.trendingImages} source={{uri:encodeURI(item.product && item.product.productPictures && item.product.productPictures != undefined && item.product.productPictures.length>0?item.product.productPictures[0].url:imagePlaceholder),priority: FastImage.priority.normal,}}
            resizeMode={FastImage.resizeMode.contain}/>
          <View style={{flexDirection:'column'}}>
            <Text numberOfLines={2} style={[STYLES.productTitle,{fontWeight:'bold',fontSize:15}]}>{item.product?item.product.name:""}</Text>
            <View style={{flexDirection:'row'}}>
              <Text numberOfLines={1} style={{marginTop:4,fontSize:13,color:'gray',fontFamily:'DIN-Regular',marginTop:4,marginLeft:10}}>PPU: </Text>
              <Text numberOfLines={1} style={[STYLES.productTitle,{marginTop:2,marginLeft:0,fontSize:16,width:SCREEN_WIDTH-165}]}>{item.price?item.price.currency:""} {item.price?item.price.value:""}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text numberOfLines={1} style={{marginTop:4,fontSize:13,color:'gray',fontFamily:'DIN-Regular',marginTop:4,marginLeft:10}}>{i18.minOrder}: </Text>
              <Text numberOfLines={1} style={[STYLES.productTitle,{marginTop:4,marginLeft:0,width:SCREEN_WIDTH-200}]}>{item.quantity} {item.quantity>1?i18.pieces:i18.piece}</Text>
          </View>
          </View>
        </View>
        <View style={[STYLES.horzLine,{marginTop:10}]}/>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginTop:10,color:'gray'}]}>{i18.commission} :</Text>
          <Text style={[STYLES.title,{marginTop:10,color:'black',marginLeft:0}]}> {item.price?item.price.currency:""} {item.commission?item.commission:""}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginTop:5,color:'gray'}]}>{i18.sellerShare} :</Text>
          <Text style={[STYLES.title,{marginTop:5,color:'black',marginLeft:0}]}> {item.price?item.price.currency:""} {item.sellerShare?item.sellerShare:""}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={[STYLES.total,{marginTop:5,color:'gray'}]}>{i18.total} :</Text>
          <Text style={[STYLES.title,{marginTop:5,color:'black',marginLeft:0}]}>{item.grandTotal?item.grandTotal.currency:""} {item.grandTotal?item.grandTotal.value:"0"}</Text>
        </View>
        <Text style={[STYLES.productTitle,{width:SCREEN_WIDTH-40,color:this.getStatusTextColor(item)}]}>{this.getStatus(item.status)}</Text>
        </TouchableOpacity>
      </CardView>
       }/>
       <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />
      </View>
    )
  }
}
