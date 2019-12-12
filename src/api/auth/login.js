import {BASE_URL,LOGIN,AUTH_URL} from '../url/url';

export function login(email,password,lang){
  return fetch(BASE_URL+LOGIN+'?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "email":email,
      "password":password,
    })
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
