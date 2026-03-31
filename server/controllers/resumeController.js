
import mongoose from 'mongoose';
import Resume from "../models/Resume.js";
import imageKit from "../configs/imageKit.js";
import { Readable, PassThrough } from 'stream';

//controller for creating a new resume
// post: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;
        // userId should come from your auth middleware (e.g., req.userId)
        const userId = req.userId; 

        const newResume = new Resume({
            title,
            userId,
            // The model defaults handle the rest (template, skills, etc.)
        });

        await newResume.save();
        res.status(201).json({ success: true, resume: newResume });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// controller for deleting a resume
// delete: /api/resumes/delete
export const deleteResume = async (req, res) => {
try{
    const userId = req.userId;
    const{resumeId} = req.params;

   await Resume.findOneAndDelete({_id: resumeId, userId})
    //return success message
    return res.status(201).json({message: "resume deleted successfully"})
}catch( error ){
    return res.status(500).json({ message:  error.message})
    }


}
//get resume by id
// get: /api/resumes/get
export const getResumeById = async (req, res) => {
try{
    const userId = req.userId;
    const{resumeId} = req.params;

   const resume = await Resume.findOne({_id: resumeId, userId})
   if(!resume){
    return res.status(404).json({ message: 'resume not found'})
   }
   resume._v = undefined;
   resume.createdAt = undefined;
    resume.updatedAt = undefined;

    //return success message
   return res.status(201).json({ resume})
}catch( error ){
    return res.status(500).json({ message:  error.message})
    }


}
//get resume by public id
// get: /api/resumes/public
    
export  const getpublicResumeById = async (req, res) => {
    try{

        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId})
        if(!resume){
            return res.status(404).json({ message: 'resume not found'})
           }
           
           return res.status(201).json({ resume})
    }catch( error ){
        return res.status(500).json({ message:  error.message})
    }
}

//controller for updating a resume
// put: /api/resumes/update
export const updateResume = async (req, res) => {
  console.log("updateResume called");

  try {
    const { resumeId, removeBackground } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    let resumeData = {};
    if (req.body.resumeData) {
      try {
        resumeData = JSON.parse(req.body.resumeData);
      } catch (err) {
        return res.status(400).json({ message: "Invalid resumeData JSON" });
      }
    }
    const { public: isPublic } = req.body;

    let imageUrl = resumeData.personal_info?.image || "";

    // ✅ Upload image
    if (req.file) {
      console.log("Uploading image...");

      const uploadOptions = {
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "user-resumes",
      };

      const removeBg = [true, "true", "yes", "1", "on"].includes(
        String(removeBackground).toLowerCase()
      );
      console.log("removeBackground", removeBackground, "removeBg", removeBg);

      if (removeBg) {
        uploadOptions.extensions = [
          {
            name: "remove-bg",
            options: {
              add_shadow: true,
            },
          },
        ];
        console.log("✅ remove-bg applied");
      }

      console.log("Upload options:", uploadOptions);

      const uploadedImage = await imageKit.files.upload(uploadOptions);

      imageUrl = uploadedImage.url;
    }

    // ✅ attach image
    resumeData.personal_info = {
      ...resumeData.personal_info,
      image: imageUrl,
    };

     const updateFields = {
       ...resumeData,
       };

       // ✅ ADD THIS (IMPORTANT)
       if (typeof isPublic !== "undefined") {
          updateFields.public = isPublic;
          }

    // ✅ save
    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      resumeData,
      { new: true }
    );

    res.json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};