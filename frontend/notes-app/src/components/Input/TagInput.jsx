import React from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { useState } from 'react';

const  TagInput = ({ tags, setTags}) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = ()=>{
        if(inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e)=>{
        if (e.key === "Enter"){
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove)=>{
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

  return (
    <div>

        {tags?.length > 0 && 
            <div className='flex items-center gap-2 flex-wrap mt-2'>
                {tags.map(({ tag, index }) => {
                    <span key={index} className='text-black'>
                        # {tag}
                        <button onClick={()=> {
                            handleRemoveTag(tag);
                        }}>
                            <MdClose />
                        </button>
                    </span>
                })}
            </div>
        }
      <div className='flex items-center gap-2 mt-3'>
        <input 
            type="text" 
            className='text-sm bg-transparent border px-3 py-3 rounded outline-none' 
            placeholder='Add tags'
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
        />

        <button 
            className='group w-10 h-10 flex items-center justify-center rounded border-blue-700 border hover:bg-blue-700'
            onClick={()=>{
                addNewTag();
            }}
        >
            <MdAdd className='text-2xl text-blue-700 group-hover:text-white'/>
        </button>
      </div>
    </div>
  )
}

export default TagInput
