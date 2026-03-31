import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User, Award } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { dummyResumeData } from '../assets/assets'
import PersonalInfoForm from '../components/PersonlInfoform.jsx'
import ResumePreview from '../components/ResumePreview.jsx'
import TemplateSelector from '../components/TemplateSelector.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import ProfessionalSummaryForm from '../components/professionalsummaryForm.jsx'
import ExperienceForm from '../components/ExperienceForm.jsx'
import EducationForm from '../components/EducationForm.jsx'
import ProjectForm from '../components/ProjectForm.jsx'
import AchievementsForm from '../components/AchievementsForm.jsx'
import SkillsForm from '../components/SkillsForm.jsx'
import api from '../configs/api.js'
import LanguagesForm from '../components/LanguagesForm.jsx'

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    achievements: [],
    skills: [],
    languages: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'skills', name: 'Skills', icon: Sparkles },
    { id: 'languages', name: 'Languages', icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  // Load existing resume data

// Inside ResumeBuilder.jsx
const loadExistingResume = async () => {
  try {
    // Fetch from your real database instead of dummyData
    const { data } = await api.get(`/api/resumes/get/${resumeId}`);
    
    if (data.resume) {
       data.resume.languages = data.resume.languages || [];
      data.resume.skills = data.resume.skills || [];
      data.resume.achievements = data.resume.achievements || [];
      data.resume.projects = data.resume.projects || [];
      data.resume.experience = data.resume.experience || [];
      data.resume.education = data.resume.education || [];
      setResumeData(data.resume);
      document.title = data.resume.title || "Resume Builder";
    }
  } catch (error) {
    console.error("Failed to load resume:", error);
    // Fallback to dummy data only if API fails
    const resume = dummyResumeData.find(r => r._id === resumeId);
    if (resume) setResumeData(resume);
  }
};

useEffect(() => {
  loadExistingResume();
}, [resumeId]);

 const changeResumeVisibility = async () => {
  try {
    const formData = new FormData()
    formData.append("resumeId", resumeId)

    // ✅ CORRECT WAY
    formData.append("public", !resumeData.public)

    const { data } = await api.put('/api/resumes/update', formData)

    setResumeData(prev => ({
      ...prev,
      public: data.resume.public
    }))

    toast.success("Visibility updated!")

  } catch (error) {
    console.error("error updating visibility:", error)
  }
}

  const handleShare = () => {
    const fronendendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = fronendendUrl + '/view/' + resumeId;
    if (navigator.share) {
      navigator.share({
        text: 'my resume',
        url: resumeUrl
      })
    }else {
      alert("share not supported on this browser.")
    }
  }
  const downloadResume = () => {
    // Logic to download resume as PDF
    window.print();
  }
  const saveResume = async () => {
    try{
     let updatedResumeData = structuredClone(resumeData)

       // remove image from updatedResumedata
       if( typeof resumeData.personal_info.image === 'object'){
        delete updatedResumeData.personal_info.image
       }
       const formData = new FormData();
       formData.append("resumeId", resumeId)
       formData.append('resumeData', JSON.stringify(updatedResumeData))
       removeBackground && formData.append("removeBackground" , "yes");

       const imageFile = resumeData.personal_info?.image
       if (imageFile && typeof imageFile !== 'string') {
         formData.append("image", imageFile)
       }

       const { data } = await api.put('/api/resumes/update', formData, {
  headers: {
    "Content-Type": "multipart/form-data"
    }
    })
       setResumeData(prev => ({
        ...prev,
         ...data.resume,
         languages: data.resume.languages || prev.languages,
        skills: data.resume.skills || prev.skills,
        achievements: data.resume.achievements || prev.achievements,
      }));

       return data.message; // Return for toast.promise success

    } catch (error){
      console.error("error saving resume:", error)
      throw error; // Throw to make toast.promise show error
    }
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* Left Panel */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>

            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>

              {/* Progress bar */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />

              <hr
                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000'
                style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }}
              />

              {/* Section Navigation */}
              
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className='flex items-center gap-2'>

                
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData(prev => ({ ...prev, template }))
                  }
                />
                <ColorPicker selectedColor={resumeData.accent_color } onChange={(color)=>
                  setResumeData(prev=> ({...prev , accent_color:color}))
                }/>
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex(prev => Math.max(prev - 1, 0))}
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                    >
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex(prev => Math.min(prev + 1, sections.length - 1))
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all 
                      ${activeSectionIndex === sections.length - 1 ? 'opacity-50' : ''}`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, personal_info: data }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, professional_summary: data }))
                    }
                    setResumeData= {setResumeData}
                  />
                )}

                
                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience || []}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, experience: data }))
                    }
                    setResumeData= {setResumeData}
                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education || []}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, education: data }))
                    }
                    setResumeData= {setResumeData}
                  />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.projects || []}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, projects: data }))
                    }
                    setResumeData= {setResumeData}
                  />
                )}
                {activeSection.id === 'achievements' && (
                  <AchievementsForm
                    data={resumeData.achievements || []}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, achievements: data }))
                    }
                    setResumeData= {setResumeData}
                  />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills || []}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, skills: data }))
                    }
                    setResumeData= {setResumeData}
                  />
                )}
                {activeSection.id === 'languages' && (
                 <LanguagesForm
                 data={resumeData.languages || []}
                 onChange={(data) =>
                  setResumeData(prev => ({ ...prev, languages: data }))
                 }
                />
                )}
                

              </div>
<button  onClick={ ()=> { toast.promise(saveResume(), { loading: 'Saving...', success: 'Saved successfully!', error: (err) => err?.response?.data?.message || 'Save failed' })}} className='bg-gradient-to-br from-green-100 to-green-200
              ring-green-300 text-green-600 ring hover:ring-green-400
              transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
              </button>

            </div>
          </div>

          {/* Right Panel - Preview */}

          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center
              justify-end gap-2'>
                {resumeData.public &&
                (
                  <button onClick={handleShare} className='flex items-center gap-2 px-4 p-2 text-xs bg-gradient-to-br 
                  from-blue-100 to-blue-200 text-blue-600 
                  ring-blue-300 rounded-lg hover:ring transition-colors'>
                    <Share2Icon className='size-4'/>
                   Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br 
                from-purple-100 to purple-200 text-purple-600 ring-purple-300 rounded-lg
                hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className='size-4'/> :
                  <EyeOffIcon className='size-4'/> }
                  { resumeData.public ? 'Public' : 'Private' }
                </button>
                <button onClick={downloadResume} className=' flex items-center p-2 px-4 gap -2 text-xs bg-gradient-to-br 
                from-green-100 to-green-200 text-green-600 ring-green-300 rounded-lg
                hover:ring transition-colors'>
                  <DownloadIcon className='size-4'/> Download
                </button>

              </div>

            </div>
            
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              classes="mx-auto my-4 shadow-lg"
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
