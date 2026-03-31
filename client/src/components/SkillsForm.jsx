import { Plus, X, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ( {data, onChange}) => {
    const[newSkill, setNewSkill] = useState("")
    const addSkill = () => {
        if(newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }
    const removeSkill = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }
    const handelkeypress = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            addSkill()
        }
    }

  return (
    <div className='space-y-4'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                Skills
            </h3>
            <p className='text-sm text-gray-500'>Add your technical skills here</p>
        </div>
        <div className='flex gap-2'>
            <input type='text' value={newSkill} onChange={(e) => setNewSkill (e.target.value)}
            className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none' placeholder='Enter a skill' 
             onKeyDown={handelkeypress} />
        
        <button  disabled={!newSkill.trim()}
        className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-600
            text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed' onClick={addSkill}>
                <Plus className='size-4'/>
                Add Skill
            </button>
    </div>
     {data.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
            {data.map((skills, index) => (
                <span key={index} className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1'>
                    {skills}
                    <button onClick={() => removeSkill(index)} className='ml-1 text-red-500 hover:text-red-700'>
                        <X className='size-3'/>
                    </button>
                </span>
            ))}

        </div>
     ) : (
        <div>
            <Sparkles className=' w-10 h-10 mx-auto mb-2 text-gray-300'/>
            <p className='text-center text-gray-500'>No skills added yet</p>
            <p className='text-center text-gray-500 text-sm'>Add your technical skills above</p>
        </div>
    )}
    <div>
        <p>
            Add 8-10 relevant skills. Include both technical skills (e.g., programming languages, tools) and soft skills (e.g., communication, teamwork) to showcase your abilities.
        </p>
    </div>

 </div>       
  
 

    )

}

export default SkillsForm