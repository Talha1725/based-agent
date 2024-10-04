import React, { useState, useEffect } from 'react'

const Switch = ({ checked, onChange }) => {
  const handleCheckboxChange = (e) => {
    onChange(e.target.checked)
  }

  return (
    <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
      <input
        type='checkbox'
        checked={checked}
        onChange={handleCheckboxChange}
        className='sr-only'
      />
      <span
        className={`slider flex h-7 w-14 items-center rounded-none duration-200 ${checked ? 'bg-brownCustom' : 'bg-blackCustom'
          }`}
      >
        <span
          className={`dot h-5 w-6 rounded-none bg-white duration-200 transform ${checked ? 'translate-x-7' : 'translate-x-1'
            }`}
        ></span>
      </span>
    </label>
  )
}

export default Switch
