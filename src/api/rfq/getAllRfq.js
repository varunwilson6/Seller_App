import {BASE_URL,PRODUCT,ORDER_URL,RFQ} from '../url/url';

export function getAllRfq(apiKey,lang,page,status){
  var URL_STRING=BASE_URL+RFQ+'?lang='+lang+'&page='+page
  if(status){
    URL_STRING=URL_STRING.concat("&status="+status)
  }
  console.log(URL_STRING);
  return fetch(URL_STRING,{
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
