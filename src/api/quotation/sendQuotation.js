import {BASE_URL,RFQ,PRODUCT_URL} from '../url/url';

export function sendQuotation(rfqId,title,coverLetter,productId,sellerId,quotedPrice,minQuantity,estimatedDeliveryTime,lang){
  return fetch(BASE_URL+RFQ+'/'+rfqId+'/quote?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "title" : title,
      "coverLetter" : coverLetter,
      "product" : productId,
      "seller" : sellerId,
      "quotedPrice" : quotedPrice,
      "minQuantity" : minQuantity,
      "estimatedDeliveryTime" : estimatedDeliveryTime
    })
  })
  .then((response) => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .catch((error) => {

  })
}
