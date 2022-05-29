import {useState} from 'react'
import cn from 'classnames'
import {ArrowDownIcon, ArrowUpIcon} from '@heroicons/react/solid'

const toggleAccordion = (isOpen:boolean, setIsOpen:any) =>{
    if(isOpen){
        setIsOpen(false);
    }
    else{
        setIsOpen(true);
    }
}

const Accordion = ()=>{
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div className="w-full mt-10 ring-2 ring-gray-400 ring-inset rounded transition duration-300">
            <div className="w-full shadow-md rounded px-5 flex h-16 justify-between items-center hover:cursor-pointer" onClick={()=>toggleAccordion(isOpen, setIsOpen)}>
                <h1 className="text-3xl">Class Name </h1>
                <h2 className="text-xl mt-2">Class Code</h2>
                <h3 className="text-lg mt-2">Total Student </h3>
                {isOpen ? <ArrowUpIcon className="text-gray-600 w-5" /> : <ArrowDownIcon className="text-gray-600 w-5" />}
            </div>
            <div className={`w-full shadow-md rounded px-5 flex h-56 justify-between items-center ${cn({'hidden': !isOpen})}`} >

            </div>
        </div>
    )
}

export default Accordion;