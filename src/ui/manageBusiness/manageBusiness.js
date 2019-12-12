import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,AsyncStorage,Alert,Platform,  } from 'react-native';
/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import Geocoder from 'react-native-geocoder';
import ActionSheet from 'react-native-actionsheet'
import FastImage from 'react-native-fast-image'

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

/*CONSTANTS */
import {YELLOW_COLOR,APP_COLOR,LIGHT_GRAY_TAB} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {PAYMENT,NO_REFERENCE,VIDEO,CERTIFICATE,MEMBERSHIP,UNVERIFIED,ADD_PRODUCT,QUOTATIONS,PROFILE,ORDERS,FAVOURITES,RIGHT_ARROW,BUYING_REQUEST,PROFILE_DETAILS,SETTINGS,PRIVACY,CONTRACT,CONTACT,APP_LOGO,ABOUT} from '../../constants/image';

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {userProfile} from '../../api/user/userProfile'
import {uploadImage} from '../../api/user/uploadProfilePic'

/* FUNCTIONS */
import {pickSingleWithCamera,pickFromGallery} from '../../utils/camera'

var displayPic="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
var id=""
var apiKey=""
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'From Camera', 'From Library' ]

export default class ManageBusiness extends Component{

  constructor(props){
      super(props);
      this.showActionSheet = this.showActionSheet.bind(this)
      this.handleActionSheet = this.handleActionSheet.bind(this)

      this.state={
        visible:false,
        firstTimeOpen:true,
        name:'',
        displayPic:'',
        isProfileVerified:'',
        loading:this.props.controllerName=="login"?false:true,
        country:'IN',
        selected:''
      }
    }

componentDidMount(){
  this.setState({
    visible:false
  })
//  get current location
  // navigator.geolocation.getCurrentPosition(
  //     position => {
  //       var coords = {
  //         lat:  position.coords.latitude,
  //         lng:  position.coords.longitude
  //       };

  //       Geocoder.geocodePosition(coords).then(res => {
  //         this.setState({
  //           country:res[0].country
  //         })
  //     })
  //     .catch(err => console.log(err))
  //     },
  //   (error) => console.log(error.message)
  //   );

  AsyncStorage.getItem(USER).then((value) => {
    if(value){
      var user = JSON.parse(value)
      console.log("User", value, "Lang", i18.getLanguage() )
      id=user.user.id
      apiKey=user.auth.key
      userProfile(user.user.id,apiKey,i18.getLanguage()).then((response) => {
        if(response.firstName){
          this.setState({
          firstTimeOpen:false,
          name:response.firstName+' '+response.lastName,
          displayPic:response.picture,
          visible:false,
          loading:false,
          isProfileVerified:response.isProfileVerified
        })
        }
        else{
          this.setState({
          loading:false,
        })
        }
      })
    }
  })
  AsyncStorage.getItem("currLang").then((value) => {
     if(value){
          i18.setLanguage(value)
        }
      else{
        AsyncStorage.setItem("currLang",i18.getLanguage())
        i18.setLanguage(i18.getLanguage())
      }
  })
}

onClickProfileItems(value){
    switch (value) {
      case "profile":
        Actions.Profile({
          title:i18.profileDetailsTitle,
          displayPic:this.state.displayPic
        })
          break;
      case "myCertificates":
          Actions.MyCertificates({
            title:i18.myCertificatesTitle
          })
          break;
      case "settings":
      Actions.Settings({
        title:i18.settingsTitle
      })
        break;
        case "products":
      Actions.ManageProducts({
        title:i18.manageProductsTitle
      })
        break;
        case "tc":
          Actions.TermsAndConditions({
            title:i18.TCTtile
        })
      break;
      case "contact":
        Actions.ContactUs({
          title:i18.contactUsTitle
        })
        break
      case "rfq":
        Actions.RFQ({
          title:i18.rfqTitle
        })
      break;
      case "quotations":
        Actions.AllQuotations({
          title:i18.quotationsTitle
        })
      break;
      case "myVideos":
        Actions.MyVideos({
          title:i18.myVideosTitle
        })
      break;
      case "activePlan":
        Actions.ActivePlan({
          title:i18.activePlan.toUpperCase()
        })
      break;
      case "membershipPlan":
      if(this.state.country){
        Actions.MembershipPlan({
          title:i18.membershipPlanTitle,
          country:this.state.country
        })
      }
      break;
      case "references":
        Actions.MyReferences({
          title:i18.myReferences.toUpperCase()
        })
      break;
      case "payments":
        Actions.KycForm({
          title:'KYC'
        })
      break;
      case "orders":
        Actions.AllOrders({
          title:i18.allOrdersTitle,
          id:id
        })
      break;
      default:
    }
  }
  logout(){
    Alert.alert(
i18.logout,
i18.areYouSure,
[
  {text:i18.cancel,style:'cancel'},
  {text:i18.yes,onPress: () => AsyncStorage.removeItem("username").then(() => {
      AsyncStorage.removeItem(USER).then(() => {
        Actions.Welcome()
      })
  })}
  ],
    {cancelable:false}
    )
  }
    profileVerifiedModel(){
      Alert.alert(
        '',
      i18.profileNotVerified,
      [
    {text:i18.ok}
    ],
      {cancelable:false}
      )
  }

  showActionSheet() {
 this.ActionSheet.show()
}

handleActionSheet(i) {
 this.setState({
   selected: i
 },() => {
  if(this.state.selected == 1){
    this.pickSingleWithCamera(false)
  }
   if(this.state.selected == 2){
   this.pickFromGallery(false,false)
 }
 })

}
pickSingleWithCamera(cropping) {
  pickSingleWithCamera(cropping).then(image => {
    this.setState({
      image: {uri: image.path, width: image.width, height: image.height},
      images: null,
      profileDisplay:'none'
    });
    this.imageUpload(image.path,image.mime)
  })
}
pickFromGallery(cropit,circular) {
  pickFromGallery(cropit,circular).then((image) => {
    this.setState({
      image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
      images: null,
      profileDisplay:'none'
    });
    this.imageUpload(image.path,image.mime)
})
}

renderImage(image) {
  return <Image source={image} style={[STYLES.profile]}/>
}

renderAsset(image) {
  return this.renderImage(image);
}
imageUpload(image,mime) {
  this.setState({
    loading:true
  })
    const ext=mime.split('/')[1]
    uploadImage(mime,image,ext,id,i18.getLanguage()).then((response) => {
      this.setState({
        loading:false,
        displayPic:image
      })
  })
}

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <View style={[STYLES.topSearchNav]}>
        <Text style={STYLES.navTitle}>
          {i18.accounts}
        </Text>
        <TouchableOpacity style={[STYLES.logout]} activeOpacity={1} onPress={() => this.logout()}>
          <Icon name="sign-out" size={22} color={YELLOW_COLOR}/>
        </TouchableOpacity>
      </View>

        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
        <ActionSheet ref={o => this.ActionSheet = o}options={options} cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX} onPress={this.handleActionSheet} title={i18.attachPhotos}/>

        <View style={STYLES.horzLine}/>

        <ScrollView>

        <TouchableOpacity activeOpacity={1} style={{display:this.state.firstTimeOpen == true?"none":"flex"}} onPress={this.showActionSheet}>
          <View style={[STYLES.profileContainer]}>
            {this.state.image ? this.renderAsset(this.state.image) : null}
            {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
            <FastImage style={[STYLES.profile,{display:this.state.profileDisplay}]} source={{uri:encodeURI(this.state.displayPic?this.state.displayPic:displayPic),priority: FastImage.priority.normal,}}
              resizeMode={FastImage.resizeMode.stretch}/>
            <Text style={[STYLES.text,{fontSize:16,color:'black',marginTop:SCREEN_HEIGHT/100}]}>{this.state.name}</Text>

          </View>
        </TouchableOpacity>

        <View style={STYLES.horzLine}/>

        <View style={{height:80}}>
        <Grid>
          <Col>
            <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("orders")}>
              <Image source={ORDERS} style={[STYLES.icon,{marginLeft:0,marginTop:15}]}/>
              <Text numberOfLines={1} style={[STYLES.text,{fontSize:14,color:'black',marginTop:5}]}>{i18.manageOrders}</Text>
            </TouchableOpacity>
          </Col>
          <View style={STYLES.vertLine}/>

          <Col>
            <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("references")}>
              <Image source={NO_REFERENCE} style={[STYLES.icon,{marginLeft:0,marginTop:15}]}/>
              <Text numberOfLines={1} style={[STYLES.text,{fontSize:14,color:'black',marginTop:5}]}>{i18.myReferences}</Text>
            </TouchableOpacity>
          </Col>

        </Grid>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={STYLES.grayDiv}/>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("activePlan")}>
          <View style={{flexDirection:'row'}}>
            <Image source={MEMBERSHIP} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.activePlan}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("membershipPlan")}>
          <View style={{flexDirection:'row'}}>
            <Image source={MEMBERSHIP} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.membershipPlan}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("products")}>
          <View style={{flexDirection:'row'}}>
            <Image source={ADD_PRODUCT} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.manageProducts}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("quotations")}>
        <View style={{flexDirection:'row'}}>
          <Image source={QUOTATIONS} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.quotations}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("rfq")}>
        <View style={{flexDirection:'row'}}>
          <Image source={BUYING_REQUEST} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.buyingRequest}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("payments")}>
        <View style={{flexDirection:'row'}}>
          <Image source={PAYMENT} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.payments}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <View style={STYLES.grayDiv}/>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("profile")}>
          <View style={{flexDirection:'row'}}>
            <Image source={PROFILE_DETAILS} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.profileDetails}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("myCertificates")}>
          <View style={{flexDirection:'row'}}>
            <Image source={CERTIFICATE} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.myCertificates}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("myVideos")}>
          <View style={{flexDirection:'row'}}>
            <Image source={VIDEO} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.myVideos}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("settings")}>
          <View style={{flexDirection:'row'}}>
            <Image source={SETTINGS} style={STYLES.icon}/>
            <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.settings}</Text>
          </View>
          <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <View style={STYLES.grayDiv}/>

        <View style={{flexDirection:'row'}}>
          <Image source={ABOUT} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.aboutUs}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("tc")}>
        <View style={{flexDirection:'row'}}>
          <Image source={CONTRACT} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.TC}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

        <View style={{flexDirection:'row'}}>
          <Image source={PRIVACY} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.privacyPolicy}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>

        <TouchableOpacity activeOpacity={1} onPress={() => this.onClickProfileItems("contact")}>
        <View style={{flexDirection:'row'}}>
          <Image source={CONTACT} style={STYLES.icon}/>
          <Text style={[STYLES.text,{fontSize:14,color:'black',marginTop:SCREEN_HEIGHT/31.25,alignSelf:'flex-start'}]}>{i18.contactUs}</Text>
        </View>
        <View style={[STYLES.horzLine,{marginLeft:SCREEN_HEIGHT/33.3,marginTop:SCREEN_HEIGHT/33.3}]}/>
        </TouchableOpacity>

      </ScrollView>

      </View>
    )
  }
}
