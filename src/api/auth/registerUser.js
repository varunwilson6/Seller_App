import {BASE_URL,REGISTER,AUTH_URL} from '../url/url';

export function RegisterUser(latitude,longitude,username,email,phone,location,firstName,lastName,password,companyName,role,lang){
  return fetch(BASE_URL+REGISTER+'?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "username":username,
      "email":email,
      "phone":phone,
      "location":location,
      "firstName":firstName,
      "lastName":lastName,
      "password":password,
      "companyName":companyName,
      "role":role,
	  "coordinates" : {
  		"type" : "Point",
  		"coordinates" : [latitude,longitude]
	}
    })
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
