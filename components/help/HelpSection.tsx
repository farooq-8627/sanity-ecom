import React from 'react';
import { HelpDocSection } from '@/constants/helpDocs';

interface HelpSectionProps {
  section: HelpDocSection;
}

const HelpSection: React.FC<HelpSectionProps> = ({ section }) => {
  return (
    <div className="mb-10 scroll-mt-32" id={section.id}>
      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
      <p className="text-gray-600 mb-6">{section.content}</p>
      
      {section.subSections && section.subSections.length > 0 && (
        <div className="space-y-6 pl-4 border-l-2 border-shop_light_bg">
          {section.subSections.map((subSection, index) => (
            <div key={index} className="pl-4">
              <h3 className="text-lg font-semibold mb-2">{subSection.title}</h3>
              <p className="text-gray-600">{subSection.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HelpSection; 