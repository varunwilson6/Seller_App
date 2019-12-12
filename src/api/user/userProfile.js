import {BASE_URL,USER,AUTH_URL} from '../url/url';

export function userProfile(id,apiKey,lang){
  console.log("lang in uSer", lang)
  return fetch(BASE_URL+'seller/'+id+'?lang='+lang,{
    method:'GET',
    headers:{
      'apikey':apiKey
    }
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {
  })
}
