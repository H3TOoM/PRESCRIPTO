import React, { useContext } from 'react'
import { FaMessage } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


const InquiriesBtn = () => {
    const { token } = useContext(AppContext)
    const navigate = useNavigate()

    const handleRedirect = () => {

        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please Login First",
            });
            navigate('/login')
        }
        else {
            navigate('/inquiries')
        }

    }
    return (
        <button
            className="w-15 h-15 bg-[#5F6FFF] absolute z-10 fixed top-[85%] left-[93%] rounded-full flex justify-center items-center cursor-pointer shadow-lg shadow-[#5F6FFF]-500/50 max-md:left-[80%] max-md:top-[88%]"
            onClick={() => handleRedirect()}
        >
            <FaMessage className="text-xl text-white" />
        </button >
    )
}

export default InquiriesBtn