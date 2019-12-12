import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Router,Scene,Actions,ActionConst} from 'react-native-router-flux';

/* CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB} from './src/constants/colors'
import {SCREEN_WIDTH,SCREEN_HEIGHT} from './src/constants/common';
import {BACK,APP_LOGO} from './src/constants/image';

/* COMPONENTS */

/* LOGIN */
import Welcome from './src/ui/login/welcome';
import Login from './src/ui/login/login';
import Signup from './src/ui/login/signup';
import ForgotPassword from './src/ui/login/forgotPassword';
import VerifyEmail from './src/ui/login/verifyEmail';

/* BOTTOM TAB */
import BottomTab from './src/ui/bottomTab/bottomTab';

/* PRODUCTS */
import ManageProducts from './src/ui/manageProducts/manageProducts';
import AddProduct from './src/ui/manageProducts/addProduct';
import ProductCategories from './src/ui/manageProducts/productCategories';
import ProductSubCategories from './src/ui/manageProducts/productSubCategories';
import AllProducts from './src/ui/manageProducts/allProducts';
import ProductDetails from './src/ui/manageProducts/productDetails';
import CategoryTermsAndConditions from './src/ui/manageProducts/termsAndConditions';
import ProductPreview from './src/ui/manageProducts/productPreview';

/* SETTINGS */
import Settings from './src/ui/settings/settings';
import SupportedLanguages from './src/ui/settings/supportedLanguages';

/* ACCOUNTS */
import Profile from './src/ui/accounts/profile';
import ChangePassword from './src/ui/accounts/changePassword';

/* CONTACT US */
import ContactUs from './src/ui/contact/contactUs';

/* PDF */
import TermsAndConditions from './src/ui/pdf/termsAndConditions';

/* RFQ */
import RFQ from './src/ui/rfq/rfq';
import RFQDetails from './src/ui/rfq/rfqDetails';

/* QUOTATIONS */
import SendQuotations from './src/ui/quotations/sendQuotations';
import AllQuotations from './src/ui/quotations/allQuotations';
import QuotationDetails from './src/ui/quotations/quotationDetails';

/* MEMBERSHIP PLAN */
import MembershipPlan from './src/ui/membershipPlan/membershipPlan';
import MembershipPlanDetails from './src/ui/membershipPlan/membershipPlanDetails';
import ActivePlan from './src/ui/membershipPlan/activePlan';

/* CERTIFICATES */
import MyCertificates from './src/ui/myCertificates/myCertificates';
import ViewCertificate from './src/ui/myCertificates/viewCertificate';

/* MY VIDEOS */
import MyVideos from './src/ui/myVideos/myVideos';

/* ORDERS */
import AllOrders from './src/ui/orders/allOrders';
import OrderDetails from './src/ui/orders/orderDetails';
import TrackOrder from './src/ui/orders/trackOrder';

/* MESSAGE CENTER */
import MessageCenter from './src/ui/messageCenter/messageCenter';

/* REVIEWS */
import AllReviews from './src/ui/reviews/allReviews';

/* MY REFERENCES */
import MyReferences from './src/ui/myReferences/myReferences';
import AddReference from './src/ui/myReferences/addReference';

/* PAYMENT */
import KycForm from './src/ui/payments/kycForm';

export default class App extends Component {

  renderLeftButton() {
        return () => (
            <TouchableOpacity activeOpacity={1} onPress={() => this.backAction()}>
                <View style={{width:40,height:40,marginLeft:10}}>
                    <Image source={BACK} style={styles.BackBtn}/>
                </View>
            </TouchableOpacity>
                    );
    }
  renderAppLogo(){
      return() => (
          <Image source={APP_LOGO} resizeMode="contain" style={{height:30}} />
      );
    }
  renderMenuButton() {
        return () => (
            <TouchableOpacity activeOpacity={1} onPress={() => this.backAction()}>
                <View style={{width:40,height:40,marginLeft:10}}>
                    <Image source={MENU} style={styles.BackBtn}/>
                </View>
            </TouchableOpacity>
                    );
      }
  renderNoButton() {
        return () => (
            <TouchableOpacity activeOpacity={1} onPress={() => this.backAction()}>
            </TouchableOpacity>
                      );
  }

  backAction(){
    Actions.pop();
  }
  render() {
    console.disableYellowBox = true;

    return (
      <Router
          titleStyle={styles.navBarTitle}
          navigationBarStyle={styles.navBarStyle}
          renderLeftButton={() => this.renderLeftButton()}>
        <Scene key="root">
          <Scene key="Welcome" type={ActionConst.REPLACE} initial panHandlers={null} component={Welcome} hideNavBar={true}/>
          <Scene key="Login"  component={Login} hideNavBar={false}/>
          <Scene key="Signup" component={Signup} hideNavBar={false}/>
          <Scene key="VerifyEmail"  component={VerifyEmail} hideNavBar={false}/>
          <Scene key="ForgotPassword" component={ForgotPassword} hideNavBar={false}/>
          <Scene key="BottomTab" type={ActionConst.REPLACE} panHandlers={null} component={BottomTab}  hideNavBar={true}/>
          <Scene key="ManageProducts"  component={ManageProducts} hideNavBar={false} title={this.props.title}/>
          <Scene key="AddProduct" panHandlers={null} component={AddProduct} hideNavBar={false} title={this.props.title}/>
          <Scene key="Settings" component={Settings} hideNavBar={false} title={this.props.title}/>
          <Scene key="ProductCategories" component={ProductCategories} hideNavBar={false} title={this.props.title}/>
          <Scene key="ProductSubCategories" component={ProductSubCategories} hideNavBar={false} title={this.props.title}/>
          <Scene key="AllProducts"  component={AllProducts} hideNavBar={false} title={this.props.title}/>
          <Scene key="ProductDetails" component={ProductDetails} hideNavBar={false} title={this.props.title}/>
          <Scene key="SupportedLanguages" component={SupportedLanguages} hideNavBar={false} title={this.props.title}/>
          <Scene key="Profile" component={Profile} hideNavBar={false} title={this.props.title}/>
          <Scene key="ChangePassword" component={ChangePassword} hideNavBar={false} title={this.props.title}/>
          <Scene key="TermsAndConditions" component={TermsAndConditions} hideNavBar={false} title={this.props.title}/>
          <Scene key="ContactUs" component={ContactUs} hideNavBar={false} title={this.props.title}/>
          <Scene key="RFQ" component={RFQ} hideNavBar={true}/>
          <Scene key="RFQDetails" component={RFQDetails} hideNavBar={false} title={this.props.title}/>
          <Scene key="SendQuotations" component={SendQuotations} hideNavBar={false} title={this.props.title}/>
          <Scene key="AllQuotations" component={AllQuotations} hideNavBar={false} title={this.props.title}/>
          <Scene key="QuotationDetails" component={QuotationDetails} hideNavBar={false} title={this.props.title}/>
          <Scene key="MembershipPlan" component={MembershipPlan} hideNavBar={false} title={this.props.title}/>
          <Scene key="MembershipPlanDetails" component={MembershipPlanDetails} hideNavBar={false} title={this.props.title}/>
          <Scene key="MyCertificates" component={MyCertificates} hideNavBar={false} title={this.props.title}/>
          <Scene key="ViewCertificate" component={ViewCertificate} hideNavBar={false} title={this.props.title}/>
          <Scene key="MyVideos" component={MyVideos} hideNavBar={false} title={this.props.title}/>
          <Scene key="CategoryTermsAndConditions" component={CategoryTermsAndConditions} hideNavBar={false} title={this.props.title}/>
          <Scene key="AllOrders" component={AllOrders} hideNavBar={false} title={this.props.title}/>
          <Scene key="OrderDetails" component={OrderDetails} hideNavBar={false} title={this.props.title}/>
          <Scene key="MessageCenter" component={MessageCenter} hideNavBar={false} title={this.props.title}/>
          <Scene key="TrackOrder" component={TrackOrder} hideNavBar={false} title={this.props.title}/>
          <Scene key="AllReviews" component={AllReviews} hideNavBar={false} title={this.props.title}/>
          <Scene key="ProductPreview" component={ProductPreview} hideNavBar={false} title={this.props.title}/>
          <Scene key="ActivePlan" component={ActivePlan} hideNavBar={false} title={this.props.title}/>
          <Scene key="MyReferences" component={MyReferences} hideNavBar={false} title={this.props.title}/>
          <Scene key="AddReference" component={AddReference} hideNavBar={false} title={this.props.title}/>
          <Scene key="KycForm" component={KycForm} hideNavBar={false} title={this.props.title}/>

        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  navBarTitle : {
    fontSize:16,
    width:SCREEN_WIDTH-60,
    color:'white',
    fontWeight:'normal',
    fontFamily:"DIN-Regular",
    alignSelf:'center',
  },
  navBarStyle:{
    backgroundColor:APP_COLOR,
    borderBottomColor:'transparent'
  },
  BackBtn:{
    width:20,
    height:20,
    marginTop:10
  }
});
