import {BASE_URL,USER,AUTH_URL} from '../url/url';

export function updatePassword(id,apiKey,password,lang){
  return fetch(BASE_URL+USER+id+'?lang='+lang,{
    method:'PATCH',
    headers:{
      'Content-Type':'application/json',
      'apikey':apiKey
    },
    body:JSON.stringify({
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
