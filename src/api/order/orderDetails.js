import {BASE_URL,ORDER,ORDER_URL} from '../url/url';

export function orderDetails(orederId,lang,apiKey){
  return fetch(BASE_URL+ORDER+'/'+orederId+'?lang='+lang,{
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
