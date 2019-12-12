import {BASE_URL,PLAN,PLAN_URL} from '../url/url';

export function buyPlan(sellerId,plan,token,lang){
  return fetch(BASE_URL+'seller/'+sellerId+'/plan'+'?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "plan" : plan,
      "token" : token
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
