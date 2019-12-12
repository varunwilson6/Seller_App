import {Alert,NativeModules} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import {LoginManager,AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {Actions} from 'react-native-router-flux';

/* PROVIDERS CONFIG */
import {PROVIDER_CONFIG} from './config';

/* API */
import {facebookLogin} from '../auth/facebookLogin'

/* FACEBOOK AUTH */
export function loginWithFacebook(){
   LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then(
   function (result) {
     if (result.isCancelled) {
     } else {
       AccessToken.getCurrentAccessToken().then(
         (data) => {
           let accessToken = data.accessToken;
           facebookLogin(accessToken).then((response) => {
           })

         })
     }
   },
   function (error) {
   }
 )
}

/* GOOGLE AUTH */
export function loginWithGoogle(){
  GoogleSignin.configure({
    iosClientId: PROVIDER_CONFIG.IOS_CLIENT_ID, // only for iOS
  })
  .then(() => {
    GoogleSignin.signIn()
    .then((user) => {
      alert(JSON.stringify({user}))
    })
    .catch((err) => {
    })
    .done();
  });
}
