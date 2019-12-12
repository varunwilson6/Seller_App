import React, { Component } from 'react';
import {View,Text} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Ripple from 'react-native-material-ripple';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';

/* COLOR CONSTANTS */
import {PURPLE} from '../constants/colors';

/* DIMENSIONS CONSTANTS */
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../constants/common';

/* STYLES */
import {STYLES} from './styles';

export default class RippleButton extends Component {

  render() {
    return (
      <Ripple style={[this.props.style,{display:this.props.buttonDisplay}]} rippleColor={PURPLE} rippleOpacity={this.props.rippleOpacity} onPress={() => this.props.onPress()}>
        <Button activeOpacity={1} style={{borderColor:'transparent'}} activeOpacity={1} textStyle={{color:this.props.textColor?this.props.textColor:'white',fontFamily:"DIN-Regular",fontWeight:'bold',textAlign:this.props.textAlign?this.props.textAlign:'center',fontSize:this.props.fontSize?this.props.fontSize:14,alignSelf:'center',marginTop:7,marginLeft:10}}>
        <Icon name={this.props.icon} color={this.props.iconColor} size={20} style={[STYLES.icon,{display:this.props.iconDisplay}]}/>
            {this.props.title}
        </Button>
     </Ripple>
    )
  }
}
