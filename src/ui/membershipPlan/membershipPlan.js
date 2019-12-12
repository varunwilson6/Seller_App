import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList,ActivityIndicator} from 'react-native'

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

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {NO_MEMBERSHIP,APP_LOGO,ATTACH,CHECKMARK_ENABLE,CHECKMARK_DISABLE} from '../../constants/image';

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
import {allPlansByLocation} from '../../api/plans/allPlans'

var page=1

export default class MembershipPlan extends Component{

  constructor(props){
    super(props);
    this.state={
      data:[],
      loading:true,
      responsePageCount:10,
      isResultFound:null,
      bottomLoading:false
    }
  }
  componentDidMount(){
    page=1

    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      page=1
      this.getAllPlans()
    })

  }
  componentWillUnmount(){
    page=1
  }
  getAllPlans(){
    allPlansByLocation(page,this.props.country.toLowerCase(),i18.getLanguage()).then((response) => {
      let status = response[0]
      let data = response[1]
      if(data.count>0){
        this.setState({
            data:[...this.state.data,...data.plan],
            loading:false,
            responsePageCount:data.pages,
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

      this.getAllPlans()
    }
  }

  showDetails(item){
    Actions.MembershipPlanDetails({
      title:i18.detailsTitle,
      planId:item.id
    })
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
      <Text style={[STYLES.bigText,{color:BUTTON_COLOR,display:this.state.isResultFound == true?"flex":"none"}]}>{i18.expandBusiness}</Text>
      <Text style={[STYLES.bigText,{fontSize:18,fontWeight:'normal',marginTop:20,display:this.state.isResultFound == true?"flex":"none"}]}>{i18.chooseMembershipPackage}</Text>

      <Image source={NO_MEMBERSHIP} style={[STYLES.product,{display:this.state.isResultFound == false?"flex":"none"}]}/>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.isResultFound == false?"flex":"none"}]}>{i18.noPackagesAtYourLocation}</Text>

      <FlatList data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
          <CardView style={STYLES.cardView} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
            <TouchableOpacity activeOpacity={1} onPress={() => this.showDetails(item)}>
            <View style={{flexDriection:'row'}}>
              <Text style={[STYLES.name,{fontSize:16,fontWeight:'bold',width:SCREEN_WIDTH-150,color:YELLOW_COLOR}]}>{item.name}</Text>
              <Text style={[STYLES.rightAlignText,{display:item.cost && item.cost.currency?"flex":"none"}]}>{item.cost?item.cost.currency:""} {item.cost?item.cost.value:""}</Text>
            </View>
            <Text style={[STYLES.name]}>{i18.storage} : {item.storage && item.storage.value?item.storage.value:"-"} {item.storage && item.storage.units?item.storage.units:"-"}</Text>
            <Text style={[STYLES.name]}>{i18.productListing} : {item.productListing?item.productListing:"-"}</Text>
            <Text style={[STYLES.name]}>{i18.yearlyRfqLimit} : {item.rfq?item.rfq:"-"}</Text>
           </TouchableOpacity>
          </CardView>
      }/>
      <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

      </View>
    )
  }
}
