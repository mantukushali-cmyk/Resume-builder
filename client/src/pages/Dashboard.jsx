import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react' 
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import { dummyResumeData } from '../assets/assets'
import api from '../configs/api' 
import { toast } from 'react-hot-toast'
import pdfToText from 'react-pdftotext'
const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth) 
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  
  const [allResumes, setAllResumes] = useState([]) 
  const [showCreateResumes, setShowCreateResume] = useState(false) 
  const [showUploadResumes, setShowUploadResume] = useState(false) 
  const [title, setTitle] = useState('') 
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState(null); // Added this

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes',{headers:{Authorization: token}})
      setAllResumes(data.resumes)
    } catch (error) {
      console.error("Connection failed. Showing dummy data.");
      
    }
  };

  const createResume = async (e) => {
  e.preventDefault();
  try {
    
    // FIX: Change 'users' to 'resumes' to match your app.use setup
    const { data } = await api.post('/api/resumes/create', { title }, { headers:{ Authorization: token}})
    setAllResumes([...allResumes, data.resume])
    setShowCreateResume(false);
    setTitle('');
    toast.success("Resume Created!");
    navigate(`/app/builder/${data.resume._id}`);
  } catch (error) {
    toast.error("Ensure the route /create-resume exists on your backend");
  }
};
const uploadResume = async (event) => {
  event.preventDefault();
  if (!resumeFile) return toast.error("Please select a file first");
  setIsLoading(true);

  try {
    const resumeText = await pdfToText(resumeFile);
    const { data } = await api.post(
      '/api/ai/update-resume',
      { title, resumeText },
      { headers: { Authorization: token } }
    );

    // Use ?. so if data.resume is missing, it returns undefined instead of crashing
    if (data?.resume?._id) { 
      setAllResumes(prev => [...prev, data.resume]);
      setShowUploadResume(false);
      toast.success("Resume Uploaded!");
      navigate(`/app/builder/${data.resume._id}`);
    } else {
      toast.error("Server saved the resume but didn't return the ID.");
    }

  } catch (error) {
    // This catches your 500 error properly
    const message = error?.response?.data?.message || "Internal Server Error";
    toast.error(message);
    console.error("Full Error Object:", error.response);
  } finally {
    setIsLoading(false);
  }
};

 const deleteResume = async (resumeId) => {
  if (window.confirm('Are you sure you want to delete this resume?')) {
    try {
      // FIX: Changed '/api/users/resume/' to '/api/resumes/delete/'
      // Verify this matches your backend route exactly
      await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: { Authorization: token }
      })
      
      // Update the UI by filtering out the deleted resume
      setAllResumes(prev => prev.filter(r => r._id !== resumeId))
      toast.success("Deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Delete failed")
    }
  }
}

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent'> 
        Welcome, {user?.name || 'User'}
      </p>

      <div className='flex gap-4'>
        <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer'>
          <PlusIcon className='size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
          <p className='text-sm group-hover:text-indigo-600'>Create resume</p>
        </button>

        <button onClick={() => setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer'>
          <UploadCloudIcon className='size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
          <p className='text-sm group-hover:text-purple-500'>Upload Existing</p>
        </button>
      </div>

      <hr className='border-slate-200 my-6 sm:w-[305px]' />

      <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length]
          return (
            <div 
              key={resume._id} 
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border group hover:shadow-lg transition-all cursor-pointer'
              style={{ background: `${baseColor}10`, borderColor: `${baseColor}40` }}
            >
              <FilePenLineIcon className='size-7' style={{ color: baseColor }} />
              <p className='text-sm px-2 text-center font-medium' style={{ color: baseColor }}>{resume.title}</p>
              
              {/* Action Toolbar */}
<div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-5px] group-hover:translate-y-0'>
  
  {/* Edit Button */}
  <button 
    onClick={(e) => { 
      e.stopPropagation(); 
      navigate(`/app/builder/${resume._id}`); 
    }} 
    className='p-2 bg-white hover:bg-indigo-50 shadow-md rounded-full border border-slate-100 transition-colors'
    title="Edit Resume"
  >
    <PencilIcon className='size-4 text-indigo-600' />
  </button>

  {/* Delete Button */}
  <button 
    onClick={(e) => { 
      e.stopPropagation(); 
      deleteResume(resume._id); 
    }} 
    className='p-2 bg-white hover:bg-red-50 shadow-md rounded-full border border-slate-100 transition-colors'
    title="Delete Resume"
  >
    <TrashIcon className='size-4 text-red-500' />
  </button>
  
</div>
            </div>
          )
        })}
      </div>
       {showUploadResumes && (
  <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4' onClick={() => setShowUploadResume(false)}>
    <div className='bg-white rounded-2xl w-full max-w-md relative shadow-2xl overflow-hidden' onClick={e => e.stopPropagation()}>
      
      {/* Header */}
      <div className='flex justify-between items-center px-8 py-6 border-b border-slate-100'>
        <h2 className='text-xl font-bold text-slate-800'>Upload Resume</h2>
        <XIcon className='cursor-pointer text-slate-400 hover:text-red-500 transition-colors' onClick={() => setShowUploadResume(false)} />
      </div>

      <form onSubmit={uploadResume} className='p-8'>
        {/* Title Input */}
        <div className='mb-6'>
          <input 
            className='w-full border-2 border-slate-200 p-3 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all placeholder:text-slate-400' 
            placeholder='Enter resume title' 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
        </div>

        {/* Custom File Upload Area */}
        <p className='text-sm font-medium text-slate-500 mb-2'>Select resume file</p>
        <label className='group cursor-pointer'>
          <div className='w-full h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 bg-slate-50 group-hover:bg-slate-100 group-hover:border-green-400 transition-all'>
            <div className='p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform'>
              <UploadCloudIcon className='size-8 text-slate-400 group-hover:text-green-500' />
            </div>
            <p className='text-sm text-slate-500 font-medium'>
              {resumeFile ? resumeFile.name : 'Upload resume'}
            </p>
          </div>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => setResumeFile(e.target.files[0])}
            className='hidden' // Hides the ugly default button
            required
          />
        </label>

        {/* Submit Button */}
        <button 
          disabled={isLoading}
          className='w-full bg-[#10a37f] hover:bg-[#0e8c6d] text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-green-100 disabled:bg-slate-300 transition-all active:scale-95'
        >
          {isLoading ? 'Processing PDF...' : 'Upload Resume'}
        </button>
      </form>
    </div>
  </div>
)}
      {showCreateResumes && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center' onClick={() => setShowCreateResume(false)}>
          <div className='bg-white p-8 rounded-2xl w-full max-w-md relative' onClick={e => e.stopPropagation()}>
            <h2 className='text-xl font-bold mb-4'>Create New Resume</h2>
            <form onSubmit={createResume}>
              <input 
                autoFocus
                className='w-full border p-3 rounded-lg mb-4 outline-green-500' 
                placeholder='Resume Title' 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
              <button className='w-full bg-green-600 text-white py-3 rounded-lg font-medium'>Create</button>
            </form>
            <XIcon className='absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-black' onClick={() => setShowCreateResume(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard