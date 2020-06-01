// Import Firebase configuration

// import * as firebase from 'firebase';
// import moment, { duration } from 'moment';

var FormData = require('form-data');

// Function defined
// Description: upload data
async function uploadData(userObj, dataObj, imgArray, diseaseArray, timestamp) {

  // Defined path references in Firebase storage
  // let ref = firebase.database().ref(dataObj.first);
  // const dbh = firebase.firestore();

  // const imgDict = []
  // for (i = 0; i < imgArray.length; i++) {
  //   uri = imgArray[i].value;
  //   key = imgArray[i].key;


  //   imgDict.push({
  //     key: key,
  //     value: 'gs://extra-e10c8.appspot.com/images/' + key + '_' + timestamp + '.jpg',
  //   })
  // }


  // function replaceOther(arr1, arr2) {
  //   var array1 = arr1.slice()
  //   var index = array1.indexOf("Others");
  //   if (index != -1) {
  //     array1[index] = arr2;
  //   }
  //   return array1;
  // }

  // drug = dataObj.drug.includes('Others') ? replaceOther(dataObj.drug, dataObj.drugOther) : dataObj.drug;


  // dbh.collection("data").doc(timestamp).set({
  //   // staff: userObj.Email,
  //   subjectId: dataObj.id,
  //   age: dataObj.age,
  //   gender: dataObj.gender,
  //   concentrationMG: dataObj.concenG,
  //   concentrationML: dataObj.concenML,
  //   timeUsing: dataObj.timeNore,
  //   timeOccuring: dataObj.timeExtra,
  //   drug: drug,
  //   diseaseType: diseaseArray,
  //   imgUri: imgDict,
  // });

}

async function uploadImage(uri, id, eye) {

  const apiURL = 'https://xyh4ml0s-dr006-8811.in.cils.space/predict'

  const form = new FormData();

  form.append('image', {
    uri: uri,
    type: 'image/jpg',
    name: 'image.jpg',
  });

  form.append('patient_id', id);
  form.append('eye', eye);

  // upload image to api
  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: form
  })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      return(responseJson)
    })
    .catch(error => console.log(error)) //to catch the errors if any
}
  



export { uploadData }
export { uploadImage }