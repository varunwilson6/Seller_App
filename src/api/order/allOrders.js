import {BASE_URL,ORDER,ORDER_URL} from '../url/url';

export function allOrders(sellerId,page,lang,status){
  var URL_STRING=BASE_URL+ORDER+'?lang='+lang+'&seller='+sellerId+'&page='+page+'&perPage=7'
  if(status){
    URL_STRING=URL_STRING.concat('&status='+status)
  }
  return fetch(URL_STRING,{
    method:'GET'
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
