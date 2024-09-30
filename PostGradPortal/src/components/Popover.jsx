import { useState } from 'react';

export const Popover = ({ children, content }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const togglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };

    return (
        <div className="relative inline-block" onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
            {children}
            {isPopoverOpen && (
                <div className="absolute left-[-16rem] top-1/2 transform -translate-y-1/2 z-10 w-56 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                    <div className="px-2 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white">Supervisor Details</h3>
                    </div>
                    <div className="px-3 py-2">
                        <img src={content.avatar} alt={content.name} className="w-10 h-10 rounded-full mb-2" />
                        <p><strong>Name:</strong> {content.name}</p>
                        <p><strong>Email:</strong> {content.email}</p>
                        <p><strong>Office Hours:</strong> {content.officeHours}</p>
                        <p><strong>Module:</strong> {content.module}</p>
                    </div>
                    <div className="absolute w-3 h-3 bg-white border-t border-l border-gray-200 dark:border-gray-600 dark:bg-gray-800" style={{ right: '-0.375rem', top: '50%', transform: 'translateY(-50%) rotate(45deg)' }}></div>
                </div>
            )}
        </div>
    );
};
