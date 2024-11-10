// Header.tsx
import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/outline'
import arrow from '../../arrow.svg'

const Header: React.FC = () => {
    return (
        <header className="flex items-center p-2 h-12">
            <div className="w-11/12">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-[#404040]" />
                    </div>
                    <input
                        id="search"
                        name="search"
                        type="search"
                        placeholder="Search"
                        className="w-full bg-[#1A1A1A] py-2 pl-10 pr-3 text-[#ADADAD] placeholder:text-[#404040] focus:outline-[#6B34B1] focus:outline-none "
                    />
                </div>
            </div>
            <div className="w-1/6 flex flex-row justify-evenly">
                <button className="notification-icon">
                    <BellIcon className="h-6 w-6 text-[#ADADAD]" aria-hidden="true" />
                </button>
                <button className="text-[#ADADAD] text-sm flex items-center">
                    0xfC...E63d1
                    <img
                        src={arrow}
                        alt="Chevron down"
                        className="ml-1 h-5 w-5"
                    />
                </button>
            </div>
        </header>
    );
};

export default Header;
