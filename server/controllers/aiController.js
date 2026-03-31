
import  ai  from '../configs/ai.js';
import Resume from '../models/Resume.js'


//controller for enhanching a resume's professional summary using ai
// post: /api/ai/enhance-pro-sum
// Update your systemPrompt to include the word JSON

export const enhanceProfessionalSummary = async (req, res) => {
    try{

     const {userContent} = req.body;
     if(!userContent){
        return res.status(400).json({ message: 'missing required filled '})
     }
      const response =   await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
     messages: [
        {   role: "system",
            content: "You are an expert in resume writting your task is to enhance the professional summary of a resume.the summery should be 1-2 sentences also highlighitin  key skills,experience,and career objectives. Make it compelling and ATS-friendly.And only return text no opitons or anything else. "
             
        },
        {
            role: "user",
            content: userContent,
        },
    ],
 })
        
     
const enhancedContent = response.choices[0].message.content;
 return res.status(200).json({ enhancedContent })
    
}catch( error ){
        return res.status(500).json({ message: error.message })
    }
}


//controller for enhancing a resume's job description
// post: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try{

     const {userContent} = req.body;
     if(!userContent){
        return res.status(400).json({ message: 'missing required filled '})
     }
      const response =   await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
     messages: [
        {   role: "system",
            content: " you are an expert in resume writing. your task is to enhance the job description of a resume. the description should be 1-2 sentences and highlight key responsibilities and achievements. Make it compelling and ATS-friendly. And only return text no options or anything else. "
        },
        {
            role: "user",
            content: userContent,
        },
    ],
 })
        
     
const enhancedContent = response.choices[0].message.content;
 return res.status(200).json({ enhancedContent })
    
}catch( error ){
        return res.status(500).json({ message: error.message })
    }
}
//controller for uploading a resume to the database
// post: /api/ai/upload-resume

// aiController.js
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId; // Verified in authMiddleware.js [cite: 11]

    const systemPrompt = `Extract data into this EXACT JSON structure:
    {
      "personal_info": {
        "full_name": "MANTU KUSHALI", 
        "email": "mantukushali@gmail.com",
        "phone": "83272 01242",
        "profession": "Student",
        "location": "HOOGHLY, WB"
      },
      "professional_summary": "Extract the PROFILE section",
      "skills": ["C", "JAVA", "Python"],
      "education": [{
        "institution": "ADAMAS UNIVERSITY",
        "degree": "B. Tech in CSE",
        "graduation_date": "2027"
      }]
    }`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: resumeText }
      ],
      response_format: { type: "json_object" }
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    const newResume = await Resume.create({
      userId,
      title: title || "My Resume",
      ...parsedData // This spreads the correct keys into Resume.js [cite: 10]
    });

    return res.status(201).json({ success: true, resume: newResume });
  } catch (error) {
    console.error("UPLOAD ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};