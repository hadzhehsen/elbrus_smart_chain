import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { asyncAddPhoto } from '../../redux/thunk/addFoto.thunk'

export default function Images() {
  const [form, setForm] = useState(null)
  const dispatch = useDispatch()

  const formHandler = (e) => {
    setForm(e.target.files)
  }

  const subHandler = (e) => {
    e.preventDefault()
    let formData = new FormData()
    for (let i = 0; i < form.length; i++) {
      formData.append(`layer1`, form[i])
    }
    dispatch(asyncAddPhoto(formData))
    setForm(null)
  }


  return (
    <>
      <Form.Group controlId="formFile" className="p-3" >
        <Form.Label>Голова</Form.Label>
        <Form.Control type="file" name='layer1' multiple onChange={formHandler} />
        <Form.Label >Нажмите чтобы отправить</Form.Label>
        <Form.Control type="submit" onClick={subHandler} />
      </Form.Group>
    </>
  )
}
