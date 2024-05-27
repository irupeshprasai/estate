import {useState} from 'react';
import {Link} from 'react-router-dom';

export default function SignUp() {

const [formData, setFormData] = useState({});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.id] : e.target.value,
  })
}
const handelSubmit = async (e) => {
e.preventDefault();
const res =await fetch('http://localhost:3000/api/auth/signup',
  {
    method:"POST",
    headers:{
      'content-type':'application/json'
    },
    body: JSON.stringify(formData)
  }
);
const data = await res.json();
}
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username'className='border p-3 rounded-lg' id="username" onChange={handleChange}/>
        <input type='email' placeholder='email'className='border p-3 rounded-lg' id="email" onChange={handleChange}/>
        <input type='password' placeholder='password'className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>
      </form>


      <div className='flex gap-2 mt-5'>
        <p>Have a account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>SignIn</span>
        </Link>
      </div>
    </div>
  )
}
