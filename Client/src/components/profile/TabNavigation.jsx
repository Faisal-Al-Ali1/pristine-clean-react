import React from 'react';
import { Tab } from '@headlessui/react';
import { User, Calendar, History } from 'lucide-react';

const TabNavigation = () => {
  return (
    <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1">
      <Tab
        className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
           ${
             selected
               ? 'bg-white text-blue-700 shadow'
               : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
           }`
        }
      >
        <div className="flex items-center justify-center gap-2">
          <User size={18} />
          <span>Personal Info</span>
        </div>
      </Tab>
      <Tab
        className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
           ${
             selected
               ? 'bg-white text-blue-700 shadow'
               : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
           }`
        }
      >
        <div className="flex items-center justify-center gap-2">
          <Calendar size={18} />
          <span>Upcoming Bookings</span>
        </div>
      </Tab>
      <Tab
        className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
           ${
             selected
               ? 'bg-white text-blue-700 shadow'
               : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
           }`
        }
      >
        <div className="flex items-center justify-center gap-2">
          <History size={18} />
          <span>Booking History</span>
        </div>
      </Tab>
    </Tab.List>
  );
};

export default TabNavigation;