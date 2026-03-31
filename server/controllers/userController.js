import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Resume from "../models/Resume.js";


const generateToken = (userId) => {
const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"})
return token;
}


//controller for user registraction
// post: /api/users/register
export const registerUser = async (req, res) => {
try{
  let { name, email, password} = req.body;
  // normalize input
  email = email?.trim().toLowerCase();
  name = name?.trim();
  password = password?.trim();

  // check required fields
  if(!name || !email || !password){
    return res.status(400).json({ message: 'missing required fields'})
  }

  // check if user already exists
  const user = await User.findOne({ email })
  if(user){
    return res.status(400).json({ message: 'user already exists'})
  }

  // create a new user
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword
  })
    const token = generateToken(newUser._id)
    newUser.password = undefined;
    return res.status(201).json({message: "user registered successfully", user: newUser, token})

} catch( error ){
    return res.status(500).json({ message:  error.message})
}
}
//controller for user login
// post: /api/users/login
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
  email = email?.trim().toLowerCase();
  password = password?.trim();

  // check required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'missing required fields' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'invalid email or password' });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "user logged in successfully",
      user,
      token
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//controller for getting user by  id
// get: /api/users/data
export const getUserById = async (req, res) => {
try{
  const userId = req.userId;
  //check if user  exists
const user = await User.findById(userId)
if(!user){
     return res.status(404).json({ message: 'user not found'})}
     //return user
        user.password = undefined;
        return res.status(200).json({user})

} catch( error ){
    return res.status(500).json({ message:  error.message})
}
}

//controller for getting user resume
// get: /api/users/resume
export const getUserResumes = async (req, res) => {
try{
  const userId = req.userId;
  //return user resume
  const resumes = await Resume.find({userId})
  return res.status(200).json({resumes})
} catch( error ){
    return res.status(500).json({ message:  error.message})
}
}