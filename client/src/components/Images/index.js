import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addUsers } from '../../redux/actions/user.action';
import { asyncAddPhoto } from '../../redux/thunk/addFoto.thunk';

export default function Images() {
  const [form, setForm] = useState(null);
  const dispatch = useDispatch();
  const userWallet = useSelector((store) => store.users);

  const formHandler = (e) => {
    setForm(e.target.files);
  };

  // console.log(window.ethereum._state.accounts[0]);
  const subHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    console.log(form);
    for (let i = 0; i < form.length; i++) {
      formData.append(`layer1`, form[i]);
      formData.append(`wallet`, window.ethereum._state.accounts[0]);
    }
    dispatch(asyncAddPhoto(formData));
    setForm(null);
  };

  return (
    <>
      <Form.Group controlId='formFile' className='col-md-5 mx-auto'>
        <Form.Label>Голова</Form.Label>
        <Form.Control
          type='file'
          name='layer1'
          accept='application/zip'
          onChange={formHandler}
        />
        <Form.Label>Нажмите чтобы отправить</Form.Label>
        <Form.Control type='submit' onClick={subHandler} />
      </Form.Group>
    </>
  );
}
