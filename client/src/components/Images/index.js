import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { asyncAddPhoto } from '../../redux/thunk/addFoto.thunk';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../NFT/Styles.css';

export default function Images() {
  const [form, setForm] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formHandler = (e) => {
    setForm(e.target.files);
  };

  const subHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    for (let i = 0; i < form.length; i++) {
      formData.append(`layer1`, form[i]);
      formData.append(`wallet`, window.ethereum._state.accounts[0]);
    }
    dispatch(asyncAddPhoto(formData));
    setTimeout(() => {
      navigate('/create-nft');
    }, 3000);

    setForm(null);
  };

  return (
    <>
      <Form.Group controlId='formFile' className='col-md-5 mx-auto'>
        <Form.Label>Insert your layers in .zip</Form.Label>
        <Form.Control
          type='file'
          name='layer1'
          accept='application/zip'
          onChange={formHandler}
        />
      </Form.Group>
      <button className='kek m-5' type='submit' onClick={subHandler}>
        Do magic
      </button>
    </>
  );
}
