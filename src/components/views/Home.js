import React, { useEffect, useState } from 'react'
import "../styles/home.css"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'


export default function Home() {
  const navigate = useNavigate()

  const { token } = useSelector(state => state.config)


  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [])


  return (
    <div className='home'>
      <div className="home_lef">
        <div className='home_left_box'>
          <h1 className='home_title'>Мебель Рассрочка</h1>
          <div className='home_btn_box'>
            <div className='home_btn_forA'>
              <button onClick={() => navigate("/mahsulotlar")} className='home_btn'>Начать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
