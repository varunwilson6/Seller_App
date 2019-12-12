import React, { Component } from 'react'
import { View, Text, Button, TextInput, AsyncStorage, TouchableOpacity, ScrollView, Image, Alert, Platform, FlatList } from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box'
import ActionSheet from 'react-native-actionsheet'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CardView from 'react-native-cardview';
import stripe from 'tipsi-stripe'
import { timeStampToDate } from '../../utils/timeStampToData';
import {subscribe, cancelAutoRenewal  } from '../../api/plans/planRenewal';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../constants/common';
import { NO_MEMBERSHIP, PRODUCTS, APP_LOGO, ATTACH, CHECKMARK_ENABLE, CHECKMARK_DISABLE } from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/* LOCALIZATION */
import { en } from '../../localization/eng'
import { fr } from '../../localization/france'
import { de } from '../../localization/germany'
import { it } from '../../localization/italy'
import { es } from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

import { YELLOW_COLOR, BUTTON_COLOR, FORM_BACKGROUND } from '../../constants/colors';

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({ en: en, fr: fr, de: de, it: it, es: es });

/*STYLES */
import { STYLES } from './styles';

/* API */
import { USER } from '../../api/sharedPreferencesKeys'
import { userProfile } from '../../api/user/userProfile'

export default class ActivePlan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activePlan: "",
      sellerId:"",
      storageValue: "",
      storageUnit: "",
      productListing: "",
      rfq: "",
      description: "",
      currencyValue: "",
      currencyUnit: "",
      productUsed: "",
      storageUsed: "",
      storageRemaining: "",
      rfqUsed: "",
      rfqRemaining: "",
      nextRenewal: "",
      optionLoading:false,
    }
  }
  componentWillMount() {
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.profileDetails()
    })
  }

  confirmSubscription = () =>  {

    return Alert.alert(
      this.state.isPlanSubscribed ? i18.unSubscribePlan:i18.subscribePlan,
      this.state.isPlanSubscribed ? i18.unSubscribeConfirm:i18.subscribeConfirm ,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          this.setState({optionLoading:true})
          if(!this.state.isPlanSubscribed) {
            this.subscribePlan()
            .then(response => {
              let status=response[0]
              let data=response[1]
              this.setState({
                userId:data.seller,
                activePlanId:data._id,
                subscriptionId:data.subscription && data.subscription.id,
                optionLoading:false,
                isPlanSubscribed:true
              })
            })
            .catch(err => {
              this.setState({
                optionLoading:false,
              })
            })
          } else {
            this.cancelAutoRenewal()
            .then(response => {
              let status=response[0]
              let data=response[1]
              console.log(status,data )
              if(status > 300 ) {
                this.setState({
                  optionLoading:false,
                })
                return Alert.alert(
                  '',
                  i18.subscriptionFailed,
                  [
                    {text:i18.ok, onPress: () => {
                      
                    }}
                  ]
                )
              }
              this.setState({
                subscriptionId:"",
                optionLoading:false,
                isPlanSubscribed:false
              })
            })
            .catch(err => {
              this.setState({
                optionLoading:false,
              })
            })
          }
        }  
      },
      ],
      {cancelable: false},
    );
  }

  subscribePlan = () => {
    return new Promise((resolve, reject)=>{
      subscribe(this.state.userId)
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  cancelAutoRenewal = () => {
    return new Promise((resolve, reject)=>{
      cancelAutoRenewal(this.state.userId, this.state.activePlanId, this.state.subscriptionId )
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  profileDetails() {
    AsyncStorage.getItem(USER).then((value) => {
      if (value) {
        var user = JSON.parse(value)
        userProfile(user.user.id, user.auth.key, i18.getLanguage()).then((response) => {
          const activePlanSubscription = response.id && response.activePlan && response.activePlan.subscription
          const daysRemaining = activePlanSubscription ? activePlanSubscription.current_period_end : Math.round(+new Date() / 1000);
          const nextRenewal = timeStampToDate(daysRemaining)
          if (response.id) {
            this.setState({
              loading: false,
              userId:response.id ? response.id : "", 
              activePlanId: response.activePlan && response.activePlan._id,
              subscriptionId: response.activePlan && response.activePlan.subscription && response.activePlan.subscription.id,
              activePlan: response.activePlan && response.activePlan.plan && response.activePlan.plan.name ? response.activePlan.plan.name : "",
              storageValue: response.activePlan && response.activePlan.plan && response.activePlan.plan.storage && response.activePlan.plan.storage.value ? response.activePlan.plan.storage.value : "0",
              storageUnit: response.activePlan && response.activePlan.plan && response.activePlan.plan.storage && response.activePlan.plan.storage.units ? response.activePlan.plan.storage.units : "MB",
              productListing: response.activePlan && response.activePlan.plan && response.activePlan.plan.productListing ? response.activePlan.plan.productListing : "",
              rfq: response.activePlan && response.activePlan.plan && response.activePlan.plan.rfq ? response.activePlan.plan.rfq : "",
              description: response.activePlan && response.activePlan.plan && response.activePlan.plan.description ? response.activePlan.plan.description : "",
              currencyValue: response.activePlan && response.activePlan.plan && response.activePlan.plan.cost && response.activePlan.plan.cost.value ? response.activePlan.plan.cost.value : "0",
              currencyUnit: response.activePlan && response.activePlan.plan && response.activePlan.plan.cost && response.activePlan.plan.cost.currency ? response.activePlan.plan.cost.currency : "EUR",
              productUsed: response.activePlan && response.activePlan.product ? response.activePlan.product.used : "0",
              storageUsed: response.activePlan && response.activePlan.storage ? response.activePlan.storage.used : "0",
              storageRemaining: response.activePlan && response.activePlan.storage ? response.activePlan.storage.remaining : "0",
              rfqUsed: response.activePlan && response.activePlan.rfq ? response.activePlan.rfq.used : "0",
              rfqRemaining: response.activePlan && response.activePlan.rfq ? response.activePlan.rfq.remaining : "0",
              nextRenewal: nextRenewal ? nextRenewal : "",
              isPlanSubscribed: response.activePlan && response.activePlan.subscription && response.activePlan.subscription.status === "active" ? true : false 
            })
          }
          else {
            this.setState({
              loading: false,
            })
          }
        })
      }
    })
  }

  render() {
    const showSubsciptionButton = this.state.activePlan && this.state.activePlan !== "Free Plan" && true 
    const statusText=this.state.isPlanSubscribed ?i18.nextRenewal:i18.expireOn
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Spinner visible={this.state.loading || this.state.optionLoading} textStyle={{ color: '#FFF', marginTop: -60 }} />

        <Image source={NO_MEMBERSHIP} style={[STYLES.product, { display: this.state.activePlan || this.state.loading ? "none" : "flex" }]} />
        <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 25, color: 'gray', display: this.state.activePlan || this.state.loading ? "none" : "flex" }]}>{i18.noActivePlan}</Text>

        <ScrollView style={{ display: !this.state.activePlan || this.state.loading ? "none" : "flex" }}>
          <View style={{flexDirection:'row' , justifyContent:'space-between'}}>
          <Text style={[STYLES.name, {width:'50%',fontSize: 16, color: BUTTON_COLOR }]}>{i18.package} :</Text>
            {showSubsciptionButton ?
              <TouchableOpacity onPress={this.confirmSubscription}>
                <View style={[STYLES.customSubscribe]}  >
                  <Text style={{ color: "white", textAlign: "center" }}>{
                  this.state.isPlanSubscribed?
                  "Unsubscribe":"Subscribe"}</Text>
                </View>
              </TouchableOpacity> : null
            }
          </View>
          <Text style={[STYLES.textCenter, { fontSize: 18 }]}>{this.state.activePlan}</Text>
          {this.state.nextRenewal ? <Text style={[STYLES.name]}>{statusText} : {this.state.nextRenewal} </Text> : null}
          <Text style={[STYLES.name]}>{i18.storage} : {this.state.storageValue} {this.state.storageUnit}</Text>
          <Text style={[STYLES.name]}>{i18.productListing} : {this.state.productListing}</Text>
          <Text style={[STYLES.name]}>{i18.yearlyRfqLimit} : {this.state.rfq}</Text>
          <Text style={[STYLES.name, { color: 'gray' }]}>{this.state.description}</Text>
          <Text style={[STYLES.name, { color: BUTTON_COLOR }]}>{i18.packageCost} : {this.state.currencyValue} {this.state.currencyUnit}</Text>
          <View style={[STYLES.grayDiv, { marginTop: SCREEN_HEIGHT / 50 }]} />

          <Text style={STYLES.title}>{i18.availability}</Text>
          <View style={[STYLES.horzLine, { marginTop: SCREEN_HEIGHT / 50 }]} />
          <Text style={[STYLES.name]}>{i18.productUsed} : {this.state.productUsed}</Text>
          <Text style={[STYLES.name]}>{i18.storageUsed} : {this.state.storageUsed} {this.state.storageUnit}</Text>
          <Text style={[STYLES.name]}>{i18.storageRemaining} : {this.state.storageRemaining} {this.state.storageUnit}</Text>
          <Text style={[STYLES.name]}>{i18.rfqUsed} : {this.state.rfqUsed}</Text>
          <Text style={[STYLES.name]}>{i18.rfqRemaining} : {this.state.rfqRemaining}</Text>
        </ScrollView>

      </View>
    )
  }
}
