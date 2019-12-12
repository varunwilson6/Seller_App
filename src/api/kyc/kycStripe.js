import {BASE_URL,PLAN,PLAN_URL} from '../url/url';

export function createSellerStripeAccount(payload, sellerId){
    return fetch(BASE_URL+`seller/${sellerId}/stripe?ip=192.168.1.1`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload),
    }).then((response) => {
        console.log(response)
        const statusCode = response.status;
        const data = response.json();
      return Promise.all([statusCode, data]);
      })
      .catch((error) => {
    
      })

}