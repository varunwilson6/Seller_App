import React,{Component} from 'react';
import {View,Text,Image,AsyncStorage,Alert,TouchableOpacity,TextInput,ScrollView,FlatList,Platform,ActivityIndicator} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dropdown } from 'react-native-material-dropdown';
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
import {getAllRfq} from '../../api/rfq/getAllRfq'
import {USER} from '../../api/sharedPreferencesKeys'
import {searchRfq} from '../../api/rfq/searchRfq'
import {autoComplete} from '../../api/rfq/autocomplete'

var page=1
var id=""
var apiKey=""
var perPage=7

export default class RFQ extends Component{

  constructor(props){
  super(props);
  this.state={
    data:[],
    loading:false,
    responsePageCount:10,
    totalRfq:0,
    searchInput:'',
    isResultFound:null,
    autoCompleteData:[],
    isAutoCompleteSearchListShow:false,
    status:null,
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
      if(this.props.category){
        this.rfqSortByCategory()
      }
      else{
        this.getBuyingRequest()
      }
    }
  })
  }

  componentWillUnmount(){
    page=1
  }

  rfqSortByCategory(){
      page=1
      this.setState({
        data:[],
        loading:true
      }, () => {
        searchRfq(apiKey,this.state.searchInput,this.props.categoryId,this.props.subCategoryId,i18.getLanguage(),page,perPage).then((response) => {
         let status = response[0]
         let data = response[1]

         if(data.count>0){
           this.setState({
             data:[...this.state.data,...data.rfqs],
             loading:false,
             isAutoCompleteSearchListShow:false,
             totalRfq:data.count,
             isResultFound:true,
             bottomLoading:false,
             responsePageCount:response.pages,
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
      })

  }
  getBuyingRequest(){
    this.setState({
      loading:true
    }, () => {
      getAllRfq(apiKey,i18.getLanguage(),page,this.state.status).then((response) =>{
            if(response.count>0){
               this.setState({
                data:[...this.state.data,...response.rfqs],
                loading:false,
                isAutoCompleteSearchListShow:false,
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
    })
  }

  loadMore = () => {
    page=page+1;
    if(this.state.responsePageCount >= page){
      if(this.props.category){
        this.setState({bottomLoading:true})
        this.rfqSortByCategory()
      }
      else{
        this.setState({bottomLoading:true})
        this.getBuyingRequest()
      }
    }
  }


  rfqDetails(item){
    Actions.RFQDetails({
      title:i18.rfqDetailsTitle,
      rfqId:item.id
    })
  }

  searchRfq(){
      let category=undefined
      let subCategory=undefined
      page=1
      this.setState({
        loading:true,
        data:[],
      }, () => {
        searchRfq(apiKey,this.state.searchInput,category,subCategory,i18.getLanguage(),page,perPage).then((response) => {
         let status = response[0]
         let data = response[1]
         if(data.count>0){
           this.setState({
             isAutoCompleteSearchListShow:false,
             data:[...this.state.data,...data.rfqs],
             totalRfq:data.count,
              isResultFound:true,
              loading:false,
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
      })

  }

  handleSearchInput(searchInput){
  if(searchInput){
    this.setState({
      isAutoCompleteSearchListShow:true
  },() => {
    this.autoComplete(searchInput)
  })
  }
  else{
    this.setState({
    isAutoCompleteSearchListShow:false,
    searchInput:''
  })
  }
}

autoComplete(searchInput){
this.setState({
  searchInput:searchInput
},() => {
  autoComplete(searchInput,i18.getLanguage()).then((response) => {
  let status = response[0]
  let data = response[1]
  if(status<300){
    this.setState({
      autoCompleteData:data
    })
  }
})
})
}
  refreshData(){
    page=1
    this.setState({
      data:[],
      loading:true,
      searchInput:'',
      isAutoCompleteSearchListShow:false
    }, () => {
      this.getBuyingRequest()
    })
  }

  goBack(){
    Actions.pop()
  }
  openCategories(){
     Actions.ProductCategories({
      title:i18.categoryTitle,
      controllerName:"rfq"
    })
  }
  searchRfqByName(rfqId){
    Actions.RFQDetails({
      title:i18.rfqDetailsTitle,
      rfqId:rfqId
    })
  }

  onChangeStatus(status){
      page=1

    switch (status) {
      case "All":
        this.setState({
          status:null,
          data:[]
        },() => {
          this.getBuyingRequest()
        })
        break;
      case "Open":
        this.setState({
          status:'open',
          data:[]
        },() => {
          this.getBuyingRequest()
        })
        break;
      case "Rejected":
        this.setState({
          status:'rejected',
          data:[]
        },() => {
          this.getBuyingRequest()
        })
        break;
      default:
        this.setState({
          status:'closed',
          data:[]
        },() => {
          this.getBuyingRequest()
        })
    }
  }

  render(){
    let department = [{
      value: i18.allOrders,
    },{
       value: i18.open
    },{
       value: i18.rejected
    },{
       value: i18.closed
    }];
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <View style={[STYLES.topSearchNav]}>
        <Text style={STYLES.navTitle}>
          {i18.rfqTitle}
        </Text>
        <TouchableOpacity style={[STYLES.logout,{display:this.state.firstTimeOpen?"none":"flex"}]} activeOpacity={1} onPress={() => this.refreshData()}>
          <Icon name="refresh" size={22} color={YELLOW_COLOR}/>
        </TouchableOpacity>

        <TouchableOpacity style={STYLES.back} activeOpacity={1} onPress={() => this.goBack()}>
          <Image source={BACK} style={STYLES.BackBtn}/>
        </TouchableOpacity>

      </View>

          <View style={{flexDirection:'row',display:this.state.isResultFound == true?"flex":"none"}}>
          <TouchableOpacity activeOpacity={1} style={STYLES.category} onPress={() => this.openCategories()}>
            <Text style={STYLES.smallText}>{i18.shopBy}</Text>
            <Text numberOfLines={1} style={[STYLES.smallText,{color:'black',marginTop:0}]}>{this.props.subCategory?this.props.subCategory:i18.category}</Text>
          </TouchableOpacity>
            <View style={STYLES.searchContainer}>
              <View style={{flexDirection:'row'}}>
                <Image source={SEARCH} style={STYLES.ImageStyle} />
                <TextInput value={this.state.searchInput} onSubmitEditing={() => this.searchRfq()} onChangeText={searchInput => this.handleSearchInput(searchInput)} style={{flex:1,fontFamily:"DIN-Regular",marginLeft:7}} placeholder={i18.searchRfq} placeholderTextColor="gray" underlineColorAndroid="transparent"/>
              </View>
            </View>
          </View>

          <View style={{marginHorizontal:SCREEN_HEIGHT/50,display:this.state.isAutoCompleteSearchListShow?"none":"flex"}}>
            <Dropdown dropdownPosition={0} fontSize={14} value={i18.allOrders} data={department} onChangeText={(data) => this.onChangeStatus(data)}/>
          </View>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <View style={{display:this.state.isAutoCompleteSearchListShow?"none":"flex",flex:1}}>
        <View style={[STYLES.grayDiv,{display:this.state.isResultFound == true?"flex":"none"}]}>
          <Text style={STYLES.centerAlign}>{this.state.totalRfq} RFQs</Text>
        </View>

        <Image source={NO_RFQ} style={[STYLES.product,{display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.loading || this.state.isResultFound == true?"none":"flex"}]}>{i18.noRfqFound}</Text>

        <FlatList extraData={this.state} data={this.state.data} onEndReached={this.loadMore} onEndReachedThreshold={0.5} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
        <CardView style={STYLES.cardView} cardElevation={2} cardMaxElevation={2} cornerRadius={5}>
          <TouchableOpacity onPress={() => this.rfqDetails(item)} activeOpacity={1}>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}>
                <Text numberOfLines={2} style={[STYLES.productTitle,{marginTop:0}]}>{item.title}</Text>
                <Text style={[STYLES.rightAlignText,{alignItems:'flex-start',marginTop:0}]}>{item.status}</Text>
              </View>
            <View style={{flexDirection:'row'}}>
              <Icon name="shopping-cart" color="gray" size={18} style={STYLES.smallIcons}/>
              <Text numberOfLines={2} style={STYLES.minQuantity}>{item.purchaseQuantity} {item.purchaseQuantity > 1?i18.pieces:i18.piece}</Text>
              <Icon name="money" color="gray" size={18} style={[STYLES.smallIcons]}/>
              <Text numberOfLines={2} style={STYLES.minQuantity}>{item.preferredUnitPrice} /{i18.piece}</Text>
            </View>
          </TouchableOpacity>
        </CardView>
        }/>
        <ActivityIndicator style={{display:this.state.bottomLoading?"flex":"none"}} animating={this.state.bottomLoading} size="small" />

        </View>

        <View style={{display:this.state.isAutoCompleteSearchListShow?"flex":"none",flex:1,backgroundColor:'white'}}>
         <FlatList data={this.state.autoCompleteData} keyExtractor={(x,i) => i} renderItem={({index,item}) =>
           <TouchableOpacity activeOpacity={1} onPress={() => this.searchRfqByName(item.id)}>
             <Text style={STYLES.name}>{item.title}</Text>
             <View style={[STYLES.horzLine,{marginTop:15,marginLeft:10}]}/>
           </TouchableOpacity>
         }/>
       </View>

      </View>
    )
  }
}
