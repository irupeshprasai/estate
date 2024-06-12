import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handelSubmit = async(e) => {
e.preventDefault();

try{
  dispatch(signInStart());
  const res =await fetch('http://localhost:3000/api/auth/signin',
    {
      method:"POST",
      credentials: 'include',
      headers:{
        'content-type':'application/json'
      },
      body: JSON.stringify(formData)
    }
  );
  const data = await res.json();
  if(data.success === false)
    {
      dispatch(signInFailure(data.message));
  return;
    }
    
    dispatch(signInSuccess(data));
    navigate("/");
}
catch(error)
{
   dispatch(signInFailure(error.message));
    }
  }

  const handleChange = (e) =>{
    setFormData ({
      ...formData,
      [e.target.id] :e.target.value
    })
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
      <input type='email' placeholder='email'className='border p-3 rounded-lg' id="email" onChange={handleChange}/>
      <input type='password' placeholder='password'className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
      <button disabled={loading}  className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading....' : "Sign In"}</button>
      <OAuth/>
    </form>

    {error  && <p className="text-red-500">{error}</p>}
    <div className='flex gap-2 mt-5'>
      <p>Dont Have a account?</p>
      <Link to={"/sign-Up"}>
        <span className='text-blue-700'>Sign Up</span>
      </Link>
    </div>
  </div>
  )
}
