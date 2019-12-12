import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function updateProduct(productName,description,id,keywords,category,subCategory,minQuantity,productPrice,productId,apiKey,lang,quickDetails,weight,width,height,depth,
  boxSizeLength,boxSizeWidth,boxSizeHeight,boxSizeUnit,boxSizeWeight, termsAndConditions){
  var body = {
    "name" : productName,
    "description" :description,
    "seller" : id,
    "keywords" : keywords,
    "category" : category,
    "minQuantity" : minQuantity,
    "productAvailability" : true,
    "productPrice" : productPrice,
    "quickDetails":quickDetails,
    "productDimensions" : {
      "weight" : weight,
      "width" : width,
      "height" : height,
      "depth" : depth
    },
    "packageDetails" : {
      "boxSize" : {
        "length" : boxSizeLength,
        "width" : boxSizeWidth,
        "height" : boxSizeHeight,
      },
      "units" : boxSizeUnit,
      "weight" : boxSizeWeight
    },
    "termsAndConditions": termsAndConditions
  }
  if(subCategory){
    body["subCategory"] = subCategory
  }
  
  return fetch(BASE_URL+PRODUCT+productId+'?lang='+lang,{
    method:'PATCH',
    headers:{
      'Content-Type':'application/json',
      'apikey':apiKey
    },
    body:JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
