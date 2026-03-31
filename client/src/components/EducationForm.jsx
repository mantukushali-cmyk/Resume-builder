import { GraduationCap, Plus, Trash2  } from 'lucide-react';
import React from 'react'

const EducationForm = ({ data, onChange }) => {
 const addEducation = () => {
        const newEducation = {
            school: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: ""
        };
        onChange([...data, newEducation])
    } 
    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange (updated);
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        onChange(updated);
    }


  return (
    <div className="space-y-6">
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                Education
                </h3>
                <p className='text-sm text-gray-500'>Add your education details here</p>
            </div>
            <button  className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100
            text-green-700 rounded hover:bg-green-200 transition-colors' onClick={addEducation}>
                <Plus className='size-4'/>
                Add Education 
            </button>

        </div>
        {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto text-gray-300"/>
                <p>No  education added yet.</p>
                <p className='text-sm'>Click "Add Education" to get started.</p>
            </div>
        ) : (
            <div> 
            {data.map((education, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Education #{index + 1}</h4>
                        <button className="text-red-500 hover:text-red-500 transition-colors" onClick={() => removeEducation(index)}>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <input value={education.school || ""} type='text'
                        placeholder='Institution Name' className='px-3 py-2 text-sm ' onChange={(e) => updateEducation(index, 'school', e.target.value)}/>
                        <input value={education.degree || ""} type='text'
                        placeholder='Degree' className='px-3 py-2 text-sm' onChange={(e) => updateEducation(index, 'degree', e.target.value)}/>
                        <input value={education.field || ""} type='text'
                        placeholder='Field of Study' className='px-3 py-2 text-sm' onChange={(e) => updateEducation(index, 'field', e.target.value)}/>
                        <input value={education.graduation_date || ""} type='month'
                        placeholder='End Date' className='px-3 py-2 text-sm ' onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}/>
                    </div>
                     <input value={education.gpa || ""} type='text'
                        placeholder='GPA (optional)' className='px-3 py-2 text-sm' onChange={(e) => updateEducation(index, 'gpa', e.target.value)}/>
                    
                        
                    
                    

                        

                </div>
            ))}
            </div>
        )}


    </div>
  )
}


export default EducationForm