import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the function to send reset email
import { auth } from '../../backend/config';
import { Spinner } from 'flowbite-react';
import Logo from '../../assets/images/University_of_Johannesburg_Logo.png';
import LoginImage from '../../assets/images/uj-campus-apk.jpg';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Password reset email sent! Check your inbox.');
            // Optionally redirect after some time or keep the user on the page
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setErrorMessage('Error sending password reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),url(${LoginImage})` }}
        >
            <div className="absolute top-7 left-7 flex items-center space-x-4">
                <img src={Logo} alt="University of Johannesburg Logo" className="w-24 h-w-24 rounded-xl" />
                <div>
                    <h1 className="text-3xl font-bold text-white dark:text-gray-200 mb-2">PostGrade Portal</h1>
                    <p className="text-md font-normal text-white dark:text-gray-300">University of Johannesburg</p>
                </div>
            </div>

            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-center rounded-xl h-20 -mt-16 mb-6 p-4 bg-[#FF8503] dark:bg-gray-700">
                    <h1 className="text-3xl font-extrabold text-white text-center">Forgot Password</h1>
                </div>

                <form className="space-y-6" onSubmit={handlePasswordReset}>
                    <header className="text-center mb-4 dark:text-gray-200">
                        <p className="text-gray-500 dark:text-gray-400">Enter your email to receive a password reset link</p>
                    </header>

                    {errorMessage && (
                        <div className="text-red-500 text-center">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="text-green-500 text-center">
                            {successMessage}
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="email"
                            className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                        >
                            Email
                        </label>
                    </div>

                    <div className="flex justify-center">
                        <Link to="/login" className="text-sm text-blue-500 dark:text-blue-400 hover:no-underline">Back to login</Link>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full mt-10 px-4 py-2 text-base font-medium text-white bg-[#FF8503] rounded-lg hover:bg-[#FF8503] dark:bg-gray-700 dark:hover:bg-gray-600"
                            disabled={loading}
                        >
                            {loading ? <Spinner className='fill-white' size="md" /> : 'Send Reset Link'}
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
