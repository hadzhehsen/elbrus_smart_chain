import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { asyncAddPhoto } from '../../redux/thunk/addFoto.thunk';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader2 from '../Loader2';

export default function Images() {
  const [form, setForm] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState('')


  const formHandler = (e) => {
    setForm(e.target.files);
  };

  const subHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    for (let i = 0; i < form.length; i++) {
      formData.append(`layer1`, form[i]);
      formData.append(`wallet`, window.ethereum._state.accounts[0]);
      setLoader('true')
    }
    dispatch(asyncAddPhoto(formData));
    setTimeout(() => {
      setForm(null);
      setLoader('')
      navigate('/upload');
    }, 10000);

  };
  if (loader === 'true') return (
    <>
    <h1>Загрузка</h1>
    <Loader2 />
    </>
  )
  return (
    <>
      <Form.Group controlId='formFile' className='col-md-5 mx-auto'>
        <Form.Label>Вставь свой архив</Form.Label>
        <Form.Control
          type='file'
          name='layer1'
          accept='application/zip'
          onChange={formHandler}
        />
        <Form.Label>Нажми чтобы отправить</Form.Label>
        <Form.Control type='submit' onClick={subHandler} />
      </Form.Group>
    </>
  );
}
