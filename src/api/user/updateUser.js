import {BASE_URL,USER,AUTH_URL} from '../url/url';

export function updateUser(id,apiKey,username,email,phone,firstName,lastName,state,cityName,zip_code,country_name,address,operationalState,operatinalCityName,operationalZipcode,operationalCountry_name,website,established,employeeCount,companyName,description,operationalAddress,mainProducts,lang,contactPersonName,contactPersonPhone,contactPersonEmail){
  return fetch(BASE_URL+'seller/'+id+'?lang='+lang,{
    method:'PATCH',
    headers:{
      'Content-Type':'application/json',
      'apikey':apiKey
    },
    body:JSON.stringify({
      "username":username,
      "email":email,
      "phone":phone,
      "firstName":firstName,
      "lastName":lastName,
      "role":"buyer",
          "registeredAddress": {
                "areaCode": zip_code,
                "country": country_name,
                "city": cityName,
                "address": address,
                "state":state
            },
            "operationalAddress": {
                "areaCode": operationalZipcode,
                "country": operationalCountry_name,
                "city": operatinalCityName,
                "address": operationalAddress,
                "state":operationalState
            },
            "website": website,
            "established": established,
            "aboutUs": description,
            "employeeCount": employeeCount,
            "companyName": companyName,
            "mainProducts":mainProducts,
            "contactPerson" : {
  	           "name" : contactPersonName,
  	           "email" : contactPersonEmail,
  	           "phone" : contactPersonPhone
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
