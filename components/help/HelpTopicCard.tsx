import React from 'react';
import Link from 'next/link';
import IconWrapper from '@/components/IconWrapper';

interface HelpTopicCardProps {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

const HelpTopicCard: React.FC<HelpTopicCardProps> = ({
  id,
  title,
  description,
  icon
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        {icon && (
          <div className="bg-shop_light_bg rounded-full p-3 flex items-center justify-center">
            <IconWrapper 
              icon={icon} 
              size={24} 
              className="text-shop_dark_green" 
            />
          </div>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        href={`/docs/${id}`}
        className="text-shop_dark_green font-medium hover:underline inline-flex items-center"
      >
        Learn more
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </Link>
    </div>
  );
};

export default HelpTopicCard; 