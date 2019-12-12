import {BASE_URL,PRODUCT,ORDER_URL,RFQ} from '../url/url';

export function sellerQuotations(sellerId,apiKey,lang,page){
  return fetch(BASE_URL+RFQ+'/quote/seller/'+sellerId+'?lang='+lang+'&page='+page,{
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
