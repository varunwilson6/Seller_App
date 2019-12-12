import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box'
import ActionSheet from 'react-native-actionsheet'
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CardView from 'react-native-cardview';
import stripe from 'tipsi-stripe'

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {PRODUCTS,APP_LOGO,ATTACH,CHECKMARK_ENABLE,CHECKMARK_DISABLE} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
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

import {YELLOW_COLOR,BUTTON_COLOR,FORM_BACKGROUND} from '../../constants/colors';

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {planDetails} from '../../api/plans/planDetails'
import {buyPlan} from '../../api/plans/buyPlan'

stripe.setOptions({
  publishableKey: 'pk_test_hf5oc3rFTkCcCEcq5MewBDKc00n95nrq18',
  androidPayMode:'test'
})

var sellerId=""
var apiKey=""

export default class MembershipPlanDetails extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      packageName:'',
      currency:'',
      cost:'',
      productListing:'',
      rfq:'',
      description:'',
      serviceName:'',
      serviceType:'',
      serviceDescription:'',
      serviceCurrencyValue:'',
      serviceCurrencyUnit:'',
      services:[],
      paymentWaiting:false
    }
  }
  componentWillMount(){
    page=1

    AsyncStorage.getItem(USER).then((value) => {
    if(value){
      AsyncStorage.getItem("currLang").then((value) => {
        i18.setLanguage(value)
        this.planDetails()
      })
      var user = JSON.parse(value)
      sellerId=user.user.id
      apiKey=user.auth.key
    }
  })
  }

  planDetails(){
    planDetails(this.props.planId,i18.getLanguage()).then((response) => {
      if(response.id){
        this.setState({
          loading:false,
          packageName:response.name,
          storageValue:response.storage && response.storage.value?response.storage.value:"-",
          storageUnit:response.storage && response.storage.units?response.storage.units:"-",
          currencyValue:response.cost && response.cost.value?response.cost.value:"0",
          currencyUnit:response.cost && response.cost.currency?response.cost.currency:"-",
          productListing:response.productListing,
          rfq:response.rfq,
          description:response.description,
          services:response.services
        })
      }
      else{
        this.setState({
          loading:false
        })
      }
    })
  }

  addCardDetails(){
  stripe.paymentRequestWithCardForm({
    // Only iOS support this options
    smsAutofillDisabled: true,
  }).then((response) => {
    if(response.tokenId){
      this.doPayment(response.tokenId)
    }
  })
}

doPayment(stripeToken){
  this.setState({
    paymentWaiting:true
  })

  buyPlan(sellerId,this.props.planId,stripeToken,i18.getLanguage(),apiKey).then((response) => {
    this.setState({
      paymentWaiting:false
    })
    let status=response[0]
    let data=response[1]
    if(status<300){
    Alert.alert(
      i18.paymentSuccessfull,
      i18.planUpgradedSuccessfully
    )
    }
    else {
      console.log("Response on failed",'\n',response ,'\n', data.errors )
      Alert.alert(
        '',
        data.message,
        [{
          text:i18.ok
        }]
      )
    }
  })
}

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/2-100,color:'gray',display:this.state.paymentWaiting == true?"flex":"none",textAlign:'center'}]}>{i18.pleaseWaitPaymentMsg}</Text>

      <View style={[STYLES.childRoot,{display:this.state.paymentWaiting == true?"none":"flex",}]}>
      <ScrollView>
      <View style={{display:this.state.loading?"none":"flex"}}>
      <Text style={[STYLES.name,{fontSize:16,color:BUTTON_COLOR}]}>{i18.package} :</Text>
      <Text style={[STYLES.textCenter,{fontSize:18}]}>{this.state.packageName}</Text>
      <Text style={[STYLES.name]}>{i18.storage} : {this.state.storageValue} {this.state.storageUnit}</Text>
      <Text style={[STYLES.name]}>{i18.productListing} : {this.state.productListing}</Text>
      <Text style={[STYLES.name]}>{i18.yearlyRfqLimit} : {this.state.rfq}</Text>
      <Text style={[STYLES.name,{color:'gray'}]}>{this.state.description}</Text>
      <Text style={[STYLES.name,{fontSize:16,color:BUTTON_COLOR}]}>{i18.packageCost} : {this.state.currencyValue} {this.state.currencyUnit}</Text>
      <Text style={[STYLES.name,{fontSize:16,color:BUTTON_COLOR,marginTop:20,display:this.state.services && this.state.services.length>0?"flex":"none"}]}>{i18.service} :</Text>

        <FlatList data={this.state.services} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
          <CardView style={STYLES.cardView} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
            <View style={{flexDriection:'row'}}>
              <Text style={[STYLES.name,{fontSize:16,fontWeight:'bold',width:SCREEN_WIDTH-150,color:YELLOW_COLOR}]}>{item.name}</Text>
              <Text style={[STYLES.rightAlignText,{display:item.cost && item.cost.currency?"flex":"none"}]}>{item.cost?item.cost.currency:""} {item.cost?item.cost.value:""}</Text>
            </View>
            <Text style={[STYLES.name]}>{i18.serviceType} : {item.type} {item.storage && item.storage.units?item.storage.units:"-"}</Text>
            <Text style={[STYLES.name]}>{item.location && item.location.country?item.location.country:""}</Text>
            <Text style={[STYLES.name,{color:'gray'}]}>{item.description}</Text>

          </CardView>
      }/>
      </View>

      </ScrollView>

      </View>
      <View style={[STYLES.button,{display:this.state.paymentWaiting == true || this.state.loading?"none":"flex",}]}>
          <TouchableOpacityBtn style={STYLES.buttonTxt} title={i18.upgradeNow} onPress={() => this.addCardDetails()}/>
      </View>

      </View>
    )
  }
}
