import {BASE_URL,PRODUCT,ORDER_URL,RFQ} from '../url/url';

export function getRfqById(id,apiKey,lang){
  return fetch(BASE_URL+RFQ+'/'+id+'?lang='+lang,{
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
