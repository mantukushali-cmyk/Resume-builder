import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      preview: "A clean and traditional resume format with clear sections and professional typography."
    },
    {
      id: 'modern',
      name: 'Modern',
      preview: "A sleek and contemporary design with bold headings and a two-column layout."
    },
    {
      id: 'minimal',
      name: 'Minimal',
      preview: "A simple and elegant template with ample white space and a focus on content."
    },
    {
      id: 'minimal-image',
      name: 'Minimal with Image',
      preview: "A minimalist design that includes a profile image for a personal touch."
    }
  ]

  return (
    <div className='relative'>
      
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100
          ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg'
      >
        <Layout size={14} />
        <span className='max-sm:hidden'>Template</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className='absolute top-full mt-2 left-0 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10'>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id)
                setIsOpen(false)
              }}
              className={`relative p-4 cursor-pointer border 
                ${selectedTemplate === template.id
                  ? 'border-blue-400 bg-blue-100'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                }`}
            >
              {/* Active check icon */}
              {selectedTemplate === template.id && (
                <div className='absolute top-2 right-2'>
                  <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                    <Check className='w-3 h-3 text-white' />
                  </div>
                </div>
              )}

              <div className='space-y-1'>
                <h4 className='font-medium text-gray-800'>
                  {template.name}
                </h4>

                <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>
                  {template.preview}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default TemplateSelector
