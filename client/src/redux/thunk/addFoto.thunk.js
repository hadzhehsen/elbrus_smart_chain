import axios from 'axios'
import { addFotos } from '../actions/addFoto.action'

export const asyncAddPhoto = (form) => async (dispatch) => {
  // console.log('=>>>>>>>>>>>>>>>>>>>>', form);
  // let formData = new FormData(form)
  // formData.append('photos', form);
  // console.log(formData)
  // console.log('fordata===================', formData);
  // for (let key in form) {
  //   // console.log('key=>>>>>>', form);
  //   formData.append(key, form[key])
  // }
  console.log('formdata=>>>>>>>>>>>>>>>>>>>>>>>', form);
  await fetch('http://localhost:3005/upload', {
    method: 'POST',
    body: form
  })
}
