const download = require("downloadjs");

export const asyncAddPhoto = (form) => async (dispatch) => {

  console.log('formdata=>>>>>>>>>>>>>>>>>>>>>>>', form);
  await fetch('http://localhost:3001/upload', {
    method: 'POST',
    credentials: 'include',
    body: form
  }).then(data => data.blob())
    .then(data => download(data))
}
