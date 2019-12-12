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
import  moment from 'moment';

/*CONSTANTS */
import {BUTTON_COLOR,LIGHT_GRAY,APP_COLOR,RATING_GREEN} from '../../constants/colors';
import {CART,ADD1,GOLD_SUPPLIER,VERIFIED,PRODUCTS} from '../../constants/image';
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

/*API */
import {allTransactions} from '../../api/order/allTransactions';
import {USER} from '../../api/sharedPreferencesKeys'

var id=""
var apiKey=""
var page=1
var imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

export default class TrackOrder extends Component{
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
      this.allTransactions()

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
      this.allTransactions()
    }
  }

  componentWillUnmount(){
    page=1
  }

allTransactions(){
    allTransactions(this.props.orderId,this.props.sellerId,page,this.props.lang,this.props.apiKey).then((response) =>{
      if(response.count>0){
        this.setState({
            loading:false,
            responsePageCount:response.pages,
            bottomLoading:false,
            data:[...this.state.data,...response.transactions],
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

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white',paddingBottom:20}}>

      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

      <FlatList data={this.state.data} style={{paddingBottom:10}} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
        <View>
          <Text style={[STYLES.title,{color:'black',fontWeight:'bold',fontSize:15}]}>{item.text}</Text>
          <Text style={[STYLES.title,{marginTop:5}]}>{moment(item.createdAt).format('LLLL')}</Text>
          <View style={[STYLES.horzLine,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/50}]}/>
        </View>
       }/>
       <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

      </View>
    )
  }
}
