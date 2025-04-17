// import { Link, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import axios from 'axios';
// import IconMail from '../../components/Icon/IconMail';
// import IconLockDots from '../../components/Icon/IconLockDots';
// import IconInstagram from '../../components/Icon/IconInstagram';
// import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
// import IconTwitter from '../../components/Icon/IconTwitter';
// import IconGoogle from '../../components/Icon/IconGoogle';

// const LoginBoxed = () => {
//     const navigate = useNavigate();//navigate: A function to programmatically navigate the user after login.
//     const [formData, setFormData] = useState({
//         // formData: Stores user input (email and password).
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);//loading: Indicates if the login request is being processed.
//     const [error, setError] = useState('');//error: Stores error messages if the login fails.


//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { id, value } = e.target;
//         setFormData({
//             ...formData,
//             [id.toLowerCase()]: value
//         });
//     };

//     const submitForm = async (e: React.FormEvent) => {
//         e.preventDefault();
         
//         setError('');// Clears previous errors
//         setLoading(true);// Sets loading state to true while waiting for the API response.
        
//         try {
//             const response = await axios.post('http://localhost:5000/login', {// Sends a POST request to http://localhost:5000/login with email and password.
//                 email: formData.email,
//                 password: formData.password
//             });

//             setLoading(false);
//             // If the response contains a token, it is stored in localStorage, and the user is redirected to the home page (navigate('/')).
//             if (response.data.token) {
//                 localStorage.setItem('token', response.data.token);
//                 navigate('/');
//             }
//         } catch (err: any) {//If login fails, an error message is displayed.
//             setLoading(false);
//             setError(err.response?.data?.error || 'Login failed. Please try again.');
//         }
//     };

//     return (
//         <div>
//             <div className="absolute inset-0">
//                 <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
//             </div>

//             <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
//                 <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
//                 <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
//                 <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
//                 <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
//                 <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)25%,rgba(255,255,255,0)_75%,#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
//                     <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
//                         <div className="mx-auto w-full max-w-[440px]">
//                             <div className="mb-10">
//                                 <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
//                                 <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
//                             </div>
//                             {error && <div className="mb-5 text-red-500 font-medium">{error}</div>}
//                             <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
//                                 <div>
//                                     <label htmlFor="Email">Email</label>
//                                     <div className="relative text-white-dark">
//                                         <input 
//                                             id="Email" 
//                                             type="email" 
//                                             placeholder="Enter Email" 
//                                             className="form-input ps-10 placeholder:text-white-dark" 
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconMail fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Password">Password</label>
//                                     <div className="relative text-white-dark">
//                                         <input 
//                                             id="Password" 
//                                             type="password" 
//                                             placeholder="Enter Password" 
//                                             className="form-input ps-10 placeholder:text-white-dark" 
//                                             value={formData.password}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconLockDots fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="flex cursor-pointer items-center">
//                                         <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
//                                         <span className="text-white-dark">Subscribe to weekly newsletter</span>
//                                     </label>
//                                 </div>
//                                 <button 
//                                     type="submit" 
//                                     className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Signing in...' : 'Sign in'}
//                                 </button>
//                             </form>
//                             <div className="relative my-7 text-center md:mb-9">
//                                 <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
//                                 <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
//                             </div>
//                             <div className="mb-10 md:mb-[60px]">
//                                 <ul className="flex justify-center gap-3.5 text-white">
//                                     <li>
//                                         <Link
//                                             to="#"
//                                             className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
//                                             style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
//                                         >
//                                             <IconInstagram />
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link
//                                             to="#"
//                                             className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
//                                             style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
//                                         >
//                                             <IconFacebookCircle />
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link
//                                             to="#"
//                                             className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
//                                             style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
//                                         >
//                                             <IconTwitter fill={true} />
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link
//                                             to="#"
//                                             className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
//                                             style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
//                                         >
//                                             <IconGoogle />
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </div>
//                             <div className="text-center dark:text-white">
//                                 Don't have an account ?&nbsp;
//                                 <Link to="/auth/boxed-signup" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
//                                     SIGN UP
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginBoxed;
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconGoogle from '../../components/Icon/IconGoogle';

const LoginBoxed = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id.toLowerCase()]: value });
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: formData.email,
                password: formData.password
            });

            setLoading(false);

            if (response.data.token) {
                // Store token and user role
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin));

                // Redirect based on role
                if (response.data.isAdmin) {
                    navigate('/'); // Redirect admin
                } else {
                    navigate('/apps/chats'); // Redirect user
                }
            }
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 p-6">
                    <div className="mx-auto w-full max-w-[440px]">
                        <h1 className="text-3xl font-extrabold uppercase text-primary md:text-4xl">Sign in</h1>
                        <p className="text-base font-bold text-white-dark">Enter your email and password to login</p>

                        {error && <div className="mb-5 text-red-500 font-medium">{error}</div>}

                        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                            <div>
                                <label htmlFor="Email">Email</label>
                                <div className="relative text-white-dark">
                                    <input 
                                        id="Email" 
                                        type="email" 
                                        placeholder="Enter Email" 
                                        className="form-input ps-10 placeholder:text-white-dark" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMail fill={true} />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="Password">Password</label>
                                <div className="relative text-white-dark">
                                    <input 
                                        id="Password" 
                                        type="password" 
                                        placeholder="Enter Password" 
                                        className="form-input ps-10 placeholder:text-white-dark" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconLockDots fill={true} />
                                    </span>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-gradient w-full mt-6"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="my-7 text-center md:mb-9">
                            <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                        </div>

                        <div className="flex justify-center gap-3.5">
                            <Link to="#" className="social-icon"><IconInstagram /></Link>
                            <Link to="#" className="social-icon"><IconFacebookCircle /></Link>
                            <Link to="#" className="social-icon"><IconTwitter /></Link>
                            <Link to="#" className="social-icon"><IconGoogle /></Link>
                        </div>

                        <div className="text-center dark:text-white mt-4">
                            Don't have an account?{' '}
                            <Link to="/auth/boxed-signup" className="text-primary underline">
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
