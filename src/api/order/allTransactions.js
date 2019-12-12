import {BASE_URL,ORDER,ORDER_URL} from '../url/url';

export function allTransactions(orderId,sellerId,page,lang,apiKey){
  return fetch(BASE_URL+ORDER+'/'+orderId+'/transactions?type=order_update&seller='+sellerId+'&lang='+lang+'&page='+page+'&perPage=7',{
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
