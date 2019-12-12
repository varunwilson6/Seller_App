import {BASE_URL,PLAN,PLAN_URL} from '../url/url';

export function subscribe(sellerId){
    return fetch(BASE_URL+`seller/${sellerId}/plan/subscribe`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then((response) => {
      const statusCode = response.status;
      const data = response.json();
    return Promise.all([statusCode, data]);
    })
    .catch((error) => {
  
    })
    }

export function cancelAutoRenewal( sellerId, planId, subscriptionId ) {
    return fetch(BASE_URL+`seller/${sellerId}/${planId}/${subscriptionId}`,{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
      return Promise.all([statusCode, data]);
      })
      .catch((error) => {
    
      })
}