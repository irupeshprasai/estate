import React, { useState , useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,udateUerSuccess,udateUserFailure, deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutUserFailure,signOutUserStart,signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profle() {

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const {currentUser, loading,error} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0); 
  const [fileUploadError, setfileUploadError]  = useState(false);
  const [formData, setformData]= useState({}); 
  const [updateSuccess, setUpdateSuccess]= useState(false);
  console.log('a'); 
  console.log(udateUerSuccess);
  console.log(formData);
  useEffect(() =>{
    if(file){
      handelFileUpload(file);

    }
    
    },[file]);
    const handelFileUpload =(file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);

      uploadTask.on('state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setfilePerc(Math.round(progress));
      },
      (error) =>{
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => {
          setformData({...formData,avatar:downloadURL});
        })
        }      
    )};

  const handelChange =(e) => {
        setformData ({...formData,[e.target.id]:e.target.value})
  }

  const handleSignOut = async(e) => {
    try{
      dispatch(signoutUserStart());
      const res = await fetch(`http://localhost:3000/api/auth/signout`,{                
                  credentials: 'include'                
              })
              const data = await res.json();
              if(data.success === false)
                {
                  dispatch(signOutUserFailure(data.message));
                  return;
                }
              dispatch(signOutUserSuccess(data));
    }
    catch(error){
deleteUserFailure(error.message);
    }
  }

  const handelDeleteUser = async(e) => {
    try{
     
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`,{
                  method:"DELETE",
                  credentials: 'include',
                  headers:{
                    'content-type':'application/json'
                  },
                  body:JSON.stringify({formData}),
              })
              const data = await res.json();
              if(data.success === false)
                {
                  dispatch(deleteUserFailure(data.message));
                  return;
                }
              dispatch(deleteUserSuccess(data));
    }
    catch(error){
deleteUserFailure(error.message);
    }
  }

  const handelSubmit= async (e) =>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
    const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`,{
                method:"POST",
                credentials: 'include',
                headers:{
                  'content-type':'application/json'
                },
                body:JSON.stringify({formData}),
            })
            const data = await res.json();
            if(data.success === false)
              {
                dispatch(udateUserFailure(data.message));
                return;
              }
            dispatch(udateUerSuccess(data));
            setUpdateSuccess (true);
           // navigate("/");
          }
          catch(error){
    dispatch(udateUserFailure(error.message));
          }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=> fileRef.current.click()} src={currentUser.avatar}  alt = "Profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p>{fileUploadError ? 
        (<span className='text-red-700'>Error Image Upload</span>) :
        filePerc > 0 && filePerc < 100 ? (<span className="text-slate-700">{`Uploading ${filePerc}%`}</span>) :
        filePerc === 100 ? (<span className="text-green-700 text-center">Image Uploaded SuccessFully</span>): "" 
        }</p>
        <input  defaultValue={currentUser.username} type='text' placeholder='userName' id='userName' className='border p-3 rounded-lg'  onChange={handelChange}/>
        <input defaultValue={currentUser.email} type='email' placeholder='email' id='email' className='border p-3 rounded-lg'  onChange={handelChange}/>
        <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handelChange}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          
          {
            loading ? 'Loading....' : 'Update'
          }
           </button>
      </form>
      
      <div className='flex justify-between mt-5'>
        <span onClick={handelDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User Updated Successfully' : ''}</p>
    </div>
  )
}
