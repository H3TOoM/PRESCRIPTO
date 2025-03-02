import React from 'react'
import { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import './style.css'

const MyAppointment = () => {

  const{doctors} = useContext(AppContext);


  return (
    <div>
      <p className='pd-3 mt-12 font-medium text-zinc-700 border-b border-gray-300'>My appointments</p>
      <div>
      {
        doctors.slice(0,3).map((item,index) => (
          <div key={index} className='grid grid-col-[1fr_2fr] gap-4 sm:flex sm:gap-6 border-b border-gray-300'>
            <div className='p-3'>
              <img src={item.image} alt="" className='w-32 bg-indigo-50'/>
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold mt-2'>{item.name}</p>
              <p>{item.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address : </p>
              <p className='text-xs'>{item.address.line1}</p>
              <p className='text-xs'>{item.address.line2}</p>
              <p className='text-sm mt-1 mb-2'><span className='text-sm text-neutral-700 font-medium'>Date & Time</span> 3, mar,2025 | 9:40 AM</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end font-medium'>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-400 hover:text-white transtion-all duration-300'>Pay Online</button>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transtion-all duration-600'>Cancel appointment</button>
            </div>
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default MyAppointment