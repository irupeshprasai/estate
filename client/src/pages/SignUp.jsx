import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); 
  const navigate = useNavigate();

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.id] : e.target.value,
  })
}
const handelSubmit = async (e) => {
e.preventDefault();
try{
  setLoading(true);
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
  if(data.success === false)
    {
      setLoading(false);
  setError(data.message);
  return;
    }
    setLoading(false);
    setError(null);
    navigate("/sign-in");
    
}
catch(error)
{
  setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }

};
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username'className='border p-3 rounded-lg' id="username" onChange={handleChange}/>
        <input type='email' placeholder='email'className='border p-3 rounded-lg' id="email" onChange={handleChange}/>
        <input type='password' placeholder='password'className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading....' : "Sign Up"}</button>
        <OAuth/>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      <div className='flex gap-2 mt-5'>
        <p>Have a account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>SignIn</span>
        </Link>
      </div>
    
    </div>
  )
}
