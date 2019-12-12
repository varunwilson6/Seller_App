import {BASE_URL,PLAN,PLAN_URL} from '../url/url';

export function planDetails(planId,lang){
  return fetch(BASE_URL+PLAN+'/'+planId,{
    method:'GET'
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
