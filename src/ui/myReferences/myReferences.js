import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList,Linking} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import CardView from 'react-native-cardview';
import call from 'react-native-phone-call'

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CANCEL,NO_REFERENCE} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';
import AddTitleModal from '../../components/addTitleModal';

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
import {userProfile} from '../../api/user/userProfile'
import {deleteReference} from '../../api/references/deleteReference'

var sellerId=""
var apiKey=""

export default class MyReferences extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      references:[],
      title:'',
      isOpenTitleModal:false,
      isResultFound:null
    }
  }
  componentWillMount(){
     this.setState({
       visible:false
     })
     AsyncStorage.getItem(USER).then((value) => {
     if(value){
       var user = JSON.parse(value)
       sellerId=user.user.id
       apiKey=user.auth.key
       this.getCurrLang()
     }
   })
   }

   userProfile(){
     userProfile(sellerId,apiKey,i18.getLanguage()).then((response) => {
       if(response.references && response.references.length>0){
         this.setState({
           loading:false,
           references:response.references && response.references.length > 0?response.references:[],
           isResultFound:true
         })
       }
       else{
         this.setState({
         loading:false,
         isResultFound:false
        })
       }
     })
   }
    getCurrLang(){
       AsyncStorage.getItem("currLang").then((value) => {
       i18.setLanguage(value)
       this.userProfile()
     })
     }

    addReference(){
      Actions.AddReference({
        title:i18.addReferences
      })
    }

    callAction(item){
    if(item.client && item.client.phone){
      const args = {
        number: item.client.phone
      }
    call(args)
    }
  }

  sendMail(item){
    if(item.client && item.client.email){
      Linking.openURL(`mailto:${item.client.email}`)
    }
  }

  openWebsite(item){
  if(item.client && item.client.website){
    var url=""
    if (!/^https?:\/\//i.test(item.client.website)) {
      url = 'http://' + item.client.website;
    }
      Linking.openURL(encodeURI(url))
      .catch(err => {
        Alert.alert(
          i18.unableToOpen,
          i18.urlIsNotCorrect,
          [{text:i18.ok}]
        )
      })
    }
  }

  clientDetails(item){
    Actions.AddReference({
      title:i18.addReferences,
      isUpdate:true,
      referenceId:item._id
    })
  }

  delete(item){
    Alert.alert(
i18.delete,
i18.areYouSure,
[
  {text:i18.cancel,style:'cancel'},
  {text:i18.yes,onPress: () => {
    this.setState({
      loading:true
    })
    deleteReference(sellerId,item._id,apiKey,i18.getLanguage()).then((response) => {
      this.userProfile()
    })
  }
  }
  ],
    {cancelable:false}
    )


  }
  render(){

    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <View style={STYLES.childRoot}>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
        <Image source={NO_REFERENCE} style={[STYLES.product,{display:this.state.isResultFound == false?"flex":"none"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.isResultFound == false?"flex":"none"}]}>{i18.noReferencesAdded}</Text>
        <FlatList data={this.state.references} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
          <CardView style={STYLES.cardView} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
            <View style={{flexDirection:'row'}}>
              <Text style={[STYLES.name,{textAlign:'left',fontSize:15}]}>{item.client?item.client.name:""}</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => this.clientDetails(item)} style={[STYLES.rightAlignIcon,{marginRight:25}]}>
                <Icon name="edit" color={BUTTON_COLOR} size={20} style={{alignSelf:'flex-end'}}/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this.delete(item)} style={[STYLES.rightAlignIcon]}>
                <Icon name="trash" color={BUTTON_COLOR} size={20} style={{alignSelf:'flex-end'}}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',display:item.client && item.client.companyName?"flex":"none"}}>
              <Icon name="building" size={15} color="gray" style={{marginLeft:10,marginTop:10}}/>
              <Text style={[STYLES.text,{textAlign:'left',marginLeft:5,marginTop:9}]}>{item.client?item.client.companyName:""}</Text>
            </View>
            <TouchableOpacity onPress={() => this.callAction(item)} activeOpacity={1}>
              <View style={{flexDirection:'row',display:item.client && item.client.phone?"flex":"none"}}>
                <Icon name="phone" size={15} color={BUTTON_COLOR} style={{marginLeft:10,marginTop:10}}/>
                <Text numberOfLines={1} style={[STYLES.text,{textAlign:'left',marginLeft:5,marginTop:9,color:BUTTON_COLOR}]}>{item.client?item.client.phone:""}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.sendMail(item)} activeOpacity={1}>
              <View style={{flexDirection:'row',display:item.client && item.client.email?"flex":"none"}}>
                <Icon name="envelope" size={15} color={BUTTON_COLOR} style={{marginLeft:10,marginTop:10}}/>
                <Text numberOfLines={1} style={[STYLES.text,{textAlign:'left',marginLeft:5,marginTop:9,color:BUTTON_COLOR}]}>{item.client?item.client.email:""}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.openWebsite(item)} activeOpacity={1}>
              <View style={{flexDirection:'row',display:item.client && item.client.website?"flex":"none"}}>
                <Icon name="globe" size={15} color={BUTTON_COLOR} style={{marginLeft:10,marginTop:10}}/>
                <Text numberOfLines={1} style={[STYLES.text,{textAlign:'left',marginLeft:5,marginTop:9,color:BUTTON_COLOR,}]}>{item.client?item.client.website:""}</Text>
              </View>
            </TouchableOpacity>

          </CardView>
        }/>

      </View>
      <View style={[STYLES.button]}>
        <TouchableOpacityBtn onPress={() => this.addReference()} style={STYLES.buttonTxt} title={i18.addReferences}/>
      </View>
      </View>
    )
  }
}
