import React,{Component} from 'react'
import{View,Text,Image,StyleSheet,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome'
import TabNavigator from 'react-native-tab-navigator';
import LocalizedStrings from 'react-native-localization';

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

import {APP_COLOR} from '../../constants/colors';

/* UI COMPONENTS */
import ManageBusiness from '../manageBusiness/manageBusiness';

import {USER} from '../../api/sharedPreferencesKeys'

export default class TabNavigation extends Component{

constructor(props) {
  super(props);
  this.state = {
    selectedTab :'business'
  }
}
componentWillMount(){
this.setState({
  visible:false
})
AsyncStorage.getItem("currLang").then((value) => {
  if(value){
    i18.setLanguage(value)
    this.setState({
      visible:false
    })
  }
})
}
  render(){
    return(
    <TabNavigator>
      <TabNavigator.Item title={i18.manageBusiness} selected={this.state.selectedTab === 'business'} renderIcon={() => <Icon name="briefcase" size={22} color="gray"/>}
        renderSelectedIcon={() => <Icon name="briefcase" size={22} color={APP_COLOR}/>} onPress={() => this.setState({ selectedTab: 'business' })}
        selectedTitleStyle={{color:APP_COLOR,fontFamily:"DIN-Regular"}}>
        <ManageBusiness />
      </TabNavigator.Item>

    </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  tabIcons: {
    width:20,
    height:20,
    fontFamily:"DIN-Regular"
  }
});
