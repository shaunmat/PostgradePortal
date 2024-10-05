import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../backend/config';
import { Spinner } from 'flowbite-react'; // Importing Spinner component
import Logo from '../../assets/images/University_of_Johannesburg_Logo.png';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Spinner state
    const [rememberMe, setRememberMe] = useState(false); // Remember Me state
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const CurrentUser = userCredential.user;

            if (CurrentUser) {
                const userEmail = CurrentUser.email;
                const userType = 
                 userEmail=="220143805@uj.ac.za"
                    ?'Admin'
                     :
                userEmail.startsWith('7')
                    ? 'Supervisor'
                    : userEmail.startsWith('2')
                    ? 'Student'
                    : userEmail.endsWith('@externalexaminer.co.za')
                    ? 'Examiner'
                    : '';

                if (userType) {
                    localStorage.setItem('userRole', userType.toLowerCase());
                    localStorage.setItem('email', userEmail);
                    if (rememberMe) {
                        localStorage.setItem('rememberedEmail', email);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }
                    if(userType=="Admin"){
                        navigate('/admin/dash');
                    }
                    else{
                        navigate('/dashboard'); // Redirect to the dashboard
                    }
                } else {
                    setErrorMessage('Invalid user type.');
                }
            }
        } catch (error) {
            setErrorMessage('Invalid credentials. Please try again.');
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('../../src/assets/images/uj-campus-apk.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="absolute top-7 left-7 flex items-center space-x-4">
                <img src={Logo} alt="University of Johannesburg Logo" className="w-24 h-w-24 rounded-xl" />
                <div>
                    <h1 className="text-3xl font-bold text-white dark:text-gray-200 mb-2">PostGrade Portal</h1>
                    <p className="text-md font-normal text-white dark:text-gray-300">University of Johannesburg</p>
                </div>
            </div>

            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-center rounded-xl h-20 -mt-16 mb-6 p-4 bg-[#FF8503] dark:bg-gray-700">
                    <h1 className="text-3xl font-extrabold text-white text-center">Login</h1>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <header className="text-center mb-4 dark:text-gray-200">
                        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to login</p>
                    </header>

                    {errorMessage && (
                        <div className="text-red-500 text-center">
                            {errorMessage}
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="studentNumber"
                            className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                        >
                            Username
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                        >
                            Password
                        </label>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                            <button type="button" onClick={handleShowPassword}>
                                {showPassword ? <HiEyeOff className="text-gray-500 dark:text-gray-400" /> : <HiEye className="text-gray-500 dark:text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="rounded text-[#FF8503] border-[#FF8503] focus:ring-0"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember" className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className="text-sm font-medium text-[#FF8503] dark:text-blue-500">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full mt-10 px-4 py-2 text-base font-medium text-white bg-[#FF8503] rounded-lg hover:bg-[#FF8503] dark:bg-gray-700 dark:hover:bg-gray-600"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? <Spinner className='fill-white' size="md" /> : 'Login'} {/* Show spinner while loading */}
                        </button>
                    </div>
                </form>
            </div>

            <footer className="absolute bottom-0 w-full p-4 text-center text-gray-700 dark:text-gray-400">
                <p className="text-sm font-normal text-center text-white dark:text-gray-400">
                    &copy; 2024 All Rights Reserved. <br /> <span className="text-blue-500">PostGrade Portal</span> is a product of the <span className="text-blue-500">University of Johannesburg</span>
                </p>
            </footer>
        </div>
    );
};
