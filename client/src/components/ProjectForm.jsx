
import { Plus, Trash2} from 'lucide-react';
import React from 'react'


const ProjectForm = ({ data, onChange, setResumeData }) => {
    
    // Safety check - ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

  const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: ""  
        };
        onChange([...safeData, newProject])
    } 
    const removeProject = (index) => {
        const updated = safeData.filter((_, i) => i !== index);
        onChange (updated);
    }

    const updateProject = (index, field, value) => {
        const updated = [...safeData];
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
                Projects
                </h3>
                <p className='text-sm text-gray-500'>Add your projects details here</p>
            </div>
            <button  className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100
            text-green-700 rounded hover:bg-green-200 transition-colors' onClick={addProject}>
                <Plus className='size-4'/>
                Add Project 
            </button>

        </div>
        
            <div className='space-y-4 mt-6'> 
            {safeData.length > 0 ? (
                <>
                {safeData.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Project #{index + 1}</h4>
                        <button className="text-red-500 hover:text-red-500 transition-colors" onClick={() => removeProject(index)}>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>
                    <div className="grid  gap-3">
                        <input value={project.name || ""} type='text'
                        placeholder='Project Name' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none' onChange={(e) => updateProject(index, 'name', e.target.value)}/>
                        <input value={project.type || ""} type='text'
                        placeholder='Project Type' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none' onChange={(e) => updateProject(index, 'type', e.target.value)}/>
                        <textarea value={project.description || ""} rows={4}
                        placeholder='Description' className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none resize-none' onChange={(e) => updateProject(index, 'description', e.target.value)}/>
                    </div>
                </div>
            ))}
                </>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No projects added yet.</p>
                    <p className='text-sm'>Click "Add Project" to get started.</p>
                </div>
            )}
            </div>
        


    </div>
  )
}

export default ProjectForm