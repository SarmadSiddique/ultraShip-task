import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';

const CustomDropdown = ({ card, onEdit, onDelete, onPreview }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleAction = (action) => {
        setIsOpen(false);
        action(card);
    };

    return (
        <div className="relative inline-block text-left">
            <button onClick={toggleDropdown} className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12M6 6h12M6 18h12" />
                </svg>
            </button>

            {/* Conditionally show the dropdown */}
            <div className={`absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? '' : 'hidden'}`}>
                <div className="py-1">
                    <a href="#" onClick={() => handleAction(onEdit)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </a>
                    <a href="#" onClick={() => handleAction(onDelete)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </a>
                    <a href="#" onClick={() => handleAction(onPreview)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CustomDropdown;
