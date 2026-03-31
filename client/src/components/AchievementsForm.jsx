import { Plus, Trash2, Award } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import { toast } from 'react-hot-toast';

const AchievementsForm = ({ data, onChange, setResumeData }) => {

    // Safety check - ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

    const { token } = useSelector(state => state.auth)
    const [uploadingIndex, setUploadingIndex] = useState(-1)

    const addAchievement = () => {
        const newAchievement = {
            title: "",
            issuer: "",
            date: "",
            description: "",
            certificate: null,
            certificateUrl: ""
        };
        onChange([...safeData, newAchievement])
    }

    const removeAchievement = (index) => {
        const updated = safeData.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateAchievement = (index, field, value) => {
        const updated = [...safeData];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        onChange(updated);
    }

    const handleCertificateUpload = async (index, file) => {
        if (!file) return;

        setUploadingIndex(index);
        try {
            const formData = new FormData();
            formData.append('certificate', file);

            const { data: uploadData } = await api.post('/api/resumes/upload/certificate', formData, {
                headers: {
                    
                    'Content-Type': 'multipart/form-data',
                     Authorization: token 
                }
            });

             const updated = [...safeData];
updated[index] = {
  ...updated[index],
  certificateUrl: uploadData.url,
  certificate: null
};
onChange(updated);
  toast.success("Certificate uploaded successfully ✅");  
        } catch (error) {
            console.error('Certificate upload failed:', error);
            alert('Failed to upload certificate. Please try again.');
        } finally {
            setUploadingIndex(-1);
        }
    }

    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        <Award className='size-5' />
                        Achievements & Certifications
                    </h3>
                    <p className='text-sm text-gray-500'>Add your achievements and certifications here</p>
                </div>
                <button
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors'
                    onClick={addAchievement}>
                    <Plus className='size-4'/>
                    Add Achievement
                </button>
            </div>

            <div className='space-y-4 mt-6'>
                {safeData.length > 0 ? (
                    <>
                        {safeData.map((achievement, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-semibold">Achievement #{index + 1}</h4>
                                    <button
                                        className="text-red-500 hover:text-red-500 transition-colors"
                                        onClick={() => removeAchievement(index)}>
                                        <Trash2 className="size-4"/>
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    <input
                                        value={achievement.title || ""}
                                        type='text'
                                        placeholder='Achievement/Certification Title'
                                        className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none'
                                        onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                                    />
                                    <input
                                        value={achievement.issuer || ""}
                                        type='text'
                                        placeholder='Issuing Organization'
                                        className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none'
                                        onChange={(e) => updateAchievement(index, 'issuer', e.target.value)}
                                    />
                                    <input
                                        value={achievement.date || ""}
                                        type='month'
                                        placeholder='Date Received'
                                        className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none'
                                        onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                                    />
                                </div>

                                <div className='space-y-2 mb-4'>
                                    <textarea
                                        value={achievement.description || ""}
                                        rows={3}
                                        placeholder='Brief description of the achievement...'
                                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none resize-none'
                                        onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-gray-700'>Certificate Upload (Optional)</label>
                                    <div className='flex items-center gap-3'>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleCertificateUpload(index, e.target.files[0])}
                                            className='hidden'
                                            id={`certificate-${index}`}
                                            disabled={uploadingIndex === index}
                                        />
                                        <label
                                            htmlFor={`certificate-${index}`}
                                            className='flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors disabled:opacity-50'
                                        >
                                            {uploadingIndex === index ? 'Uploading...' : 'Upload Certificate'}
                                        </label>
                                        {achievement.certificateUrl && (
                                            <span className='text-sm text-green-600 flex items-center gap-1'>
                                                ✓ Certificate uploaded
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Award className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                        <p>No achievements added yet.</p>
                        <p className='text-sm'>Click "Add Achievement" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AchievementsForm