import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, setLoading } from './app/features/authSlice.js'
import api from './configs/api.js'
import {Toaster} from 'react-hot-toast'


const App = () => {
  const dispatch = useDispatch()

  const getUserData = async () => { 
    try {
        const { data } = await api.get('/api/users/data'); // api.js adds the Bearer token automatically
        if (data.user) { 
            dispatch(login({ token: localStorage.getItem('token'), user: data.user })); 
        }
    } catch (error) {
        console.log("Session expired or no token");
    } finally {
        dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    getUserData()
  }, [])
  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='app' element={<Layout />}>
         <Route index element={<Dashboard />}/>
         <Route path='builder/:resumeId' element={<ResumeBuilder />}/>

        </Route>
        <Route path='view/:resumeId' element={<Preview/>}/>
      </Routes>
    </>
  )
}

export default App
