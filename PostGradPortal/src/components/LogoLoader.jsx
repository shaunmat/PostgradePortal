import Logo from '../assets/images/University_of_Johannesburg_Logo.png'; // Adjust the path according to your project structure
import { motion } from 'framer-motion';

const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 2.0,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
};

export const LogoLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-transparent fixed top-0 left-0 z-50">
      <motion.img
        src={Logo}
        alt="Logo Loader"
        className="w-32 h-32"
        variants={pulseVariants}
        animate="pulse"
      />
    </div>
  );
};
