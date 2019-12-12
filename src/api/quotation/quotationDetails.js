import {BASE_URL,PRODUCT,ORDER_URL,RFQ} from '../url/url';
export function quotationDetails(rfqId,quoteId,lang,apiKey){
  console.log(BASE_URL+RFQ+'/'+rfqId+'/quote/'+quoteId+'?lang='+lang);
  return fetch(BASE_URL+RFQ+'/'+rfqId+'/quote/'+quoteId+'?lang='+lang,{
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
