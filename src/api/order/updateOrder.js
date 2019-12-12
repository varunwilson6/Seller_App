import {BASE_URL,ORDER,ORDER_URL} from '../url/url';

export function updateOrder(orederId,status,lang,apiKey){
  return fetch(BASE_URL+ORDER+'/'+orederId+'/status/'+status+'?lang='+lang,{
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
