import {BASE_URL,FACEBOOK} from '../url/url';

export function facebookLogin(access_token){
  return fetch(BASE_URL+FACEBOOK,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "access_token":access_token,
    })
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
