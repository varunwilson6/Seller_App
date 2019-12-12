import React,{Component} from 'react';
import {View,Text,Image,AsyncStorage,Alert,TouchableOpacity,TextInput,ScrollView,FlatList,Platform,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import CardView from 'react-native-cardview';

/*CONSTANTS */
import {YELLOW_COLOR,APP_COLOR,LIGHT_GRAY,BUTTON_COLOR} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {BACK,NO_RFQ,SEARCH,APP_LOGO,CANCEL} from '../../constants/image';
import TextField from '../../components/textField';

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
import {sellerQuotations} from '../../api/quotation/sellerQuotations'
import {USER} from '../../api/sharedPreferencesKeys'
import {searchRfq} from '../../api/rfq/searchRfq'

var page=1
var id=""
var apiKey=""
var perPage=7

export default class AllQuotations extends Component{

  constructor(props){
  super(props);
  this.state={
    data:[],
    loading:true,
    responsePageCount:10,
    totalRfq:0,
    searchInput:'',
    isResultFound:null,
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
      this.allQuotations()
    }
  })
  }

  componentWillUnmount(){
    page=1
  }


  allQuotations(){
    sellerQuotations(id,apiKey,i18.getLanguage(),page).then((response) =>{
          if(response.count>0){
             this.setState({
              data:[...this.state.data,...response.quotation],
              loading:false,
              responsePageCount:response.pages,
              totalRfq:response.count,
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
      this.allQuotations()
    }
  }


  rfqDetails(item){
    Actions.RFQDetails({
      title:i18.rfqDetailsTitle,
      rfqId:item.id
    })
  }

  showQuotationDetails(item){
    Actions.QuotationDetails({
      title:i18.quotationDetalisTitle,
      rfqId:item.rfq?item.rfq._id:"",
      quoteId:item.id
    })
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>

        <Image source={NO_RFQ} style={[STYLES.product,{display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}>{i18.noQuotationsFound}</Text>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <FlatList extraData={this.state} data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
          <CardView style={STYLES.cardView} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.showQuotationDetails(item)}>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}>
                <Text numberOfLines={2} style={[STYLES.productTitle,{marginTop:0}]}>{item.title}</Text>
                <Text style={[STYLES.rightAlignText,{alignItems:'flex-start',marginTop:0}]}>{item.status}</Text>
              </View>
            <View style={{flexDirection:'row'}}>
              <Icon name="shopping-cart" color="gray" size={18} style={STYLES.smallIcons}/>
              <Text numberOfLines={2} style={STYLES.minQuantity}>{item.minQuantity} {item.minQuantity > 1?i18.pieces:i18.piece}</Text>
              <Icon name="money" color="gray" size={18} style={[STYLES.smallIcons]}/>
              <Text numberOfLines={2} style={STYLES.minQuantity}>{item.quotedPrice} /{i18.piece}</Text>
            </View>
            <Text numberOfLines={2} style={[STYLES.productTitle,{marginTop:5,color:'gray'}]}>{i18.estimatedDeliveryTime} : {item.estimatedDeliveryTime} {i18.days}</Text>

          </TouchableOpacity>
          </CardView>
        }/>
        <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

      </View>
    )
  }
}
