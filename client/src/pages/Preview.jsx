import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import { ArrowLeftIcon, Loader } from 'lucide-react'
import api from '../configs/api.js'

const Preview = () => {
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const loadResume = async () => {
    try {
        // Try API first
        const { data } = await api.get('/api/resumes/public/' + resumeId)
        setResumeData(data.resume);
    } catch (error) {
        // If API fails, find it in the dummy data
         console.log("API ERROR:", error.response?.data || error.message);
        const dummy = dummyResumeData.find(r => r._id === resumeId);
        setResumeData(dummy);
    } finally {
        setIsLoading(false);
    }
}
  useEffect(() => {
     if(resumeId) loadResume();},[resumeId])
  
  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3Xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template}
        accentColor={resumeData.accent_color}  className="py-4 bg-white"/>
      </div>
      
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      {isLoading ? <Loader/> :(
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
          <a href="/" className='mt-6 bg-green-500 hover:bg-green-600
          text-white rounded-full px-6 h-9 m-1 ring-offset-1
          ring-1 ring-green-400 flex items-center transition-colors'>
          <ArrowLeftIcon className='size-4 mr-2'/> go to home page
          </a>
          </div>
      )}
    </div>
  )
}

export default Preview
