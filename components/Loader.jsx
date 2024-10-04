import React from 'react'
import { LoaderCircle } from 'lucide-react';

function Loader({ message }) {
    return (
        <>
            <div className='h-[100vh] w-full'>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <LoaderCircle className='animate-spin text-black' size={48} />
                        <p>{message ? message : null}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loader