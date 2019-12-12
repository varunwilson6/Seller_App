import {BASE_URL,EMAIL_VERIFY_LINK,AUTH_URL} from '../url/url';

export function verifyEmail(email,lang){
  return fetch(BASE_URL+EMAIL_VERIFY_LINK+'?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "email":email
    })
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
