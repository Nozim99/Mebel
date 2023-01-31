import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


export default function CreateProductModal() {
  const { url, token } = useSelector(state => state.config)

  const [categories, setCategories] = useState([])
  // const [img, setImg] = useState([])
  const img = []

  useEffect(() => {
    axios.get(url + "categories/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(result => {
        // console.log(result.data);
        setCategories(result.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <div className='mahsulotlar_create_modal'>
      <h1>Mahsulot yaratish</h1>
      <div className='mahsulotlar_modal_item'>
        <input type="text" required list='category' />
        <div><span className="red">*</span> Kategoriya nomi</div>
        <datalist className='datalist' id='category'>
          {
            categories ? categories.map(item => {
              return <option key={item.id} value={item.name}></option>
            }) : ''
          }
        </datalist>
      </div>
      <div className='mahsulotlar_modal_item'>
        <input required type="text" />
        <div><span className="red">*</span> Mahsulot nomi</div>
      </div>
      <div className='mahsulotlar_modal_item'>
        <input required type="text" />
        <div><span className="red">*</span> Mahsulot narxi</div>
      </div>
      <div className='mahsulotlar_modal_item'>
        <textarea required name="" id="" rows="5"></textarea>
        <div><span className="red">*</span> Komment</div>
      </div>
      <div className='mahsulotlar_modal_item_img'>
        <div><span className="red">*</span> Mahsulot rasmi</div>
        <input onChange={(e) => {img.push(e.target.files[0]); console.log(img)}} type="file" accept="image/*" multiple />
        {
          img.length ? (
            img.map(item=>{
              return (
                <p>{item.name}</p>
              )
            })
          ) : ''
        }
      </div>
      <button className='mahsulotlar_modal_btn'>Yaratish</button>
    </div>
  )
}
