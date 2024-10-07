import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/University_of_Johannesburg_Logo.png';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Dummy credentials
        const dummyStudentNumber = '220143805';
        const dummyPassword = 'password';

        if (studentNumber === dummyStudentNumber && password === dummyPassword) {
            setErrorMessage('');
            navigate('/dashboard'); // Redirect to PageRoutes after successful login
        } else {
            setErrorMessage('Invalid credentials. Please try again.');
        }

        // if student number starts with 220, it's student. If it starts with 210, it's lecturer
        if (studentNumber.startsWith('220')) {
            navigate('/dashboard'); // Redirect to PageRoutes after successful login   
        } else if (studentNumber.startsWith('210')) {
            navigate('/dashboard'); // Redirect to LecturerPageRoutes after successful login
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('../../src/assets/images/uj-campus.jpg')] bg-cover bg-center bg-no-repeat dark:bg-gray-900">
            <div className="absolute top-7 left-7 flex items-center space-x-4">
                <img src={Logo} alt="University of Johannesburg Logo" className="w-24 h-w-24 rounded-xl" />
                <div>
                    <h1 className="text-3xl font-bold text-white dark:text-gray-200 mb-2">PostGrade Dashboard</h1>
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
                            id="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
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
                            <input type="checkbox" id="remember_me" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Forgot your password?</a>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="w-full mt-10 px-4 py-2 text-base font-medium text-white bg-[#FF8503] rounded-lg hover:bg-[#FF8503] dark:bg-gray-700 dark:hover:bg-gray-600">
                            Login
                        </button>
                    </div>
                </form>
            </div>

            <footer className="absolute bottom-0 w-full p-4 text-center text-gray-700 dark:text-gray-400">
                <p className="text-sm font-normal text-center text-white dark:text-gray-400">
                    &copy; 2024 All Rights Reserved. <br /> <span className="text-blue-500">PostGrade Dashboard</span> is a product of University Of Johannesburg.
                </p>
            </footer>
        </div>
    );
};
