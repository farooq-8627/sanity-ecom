import React from 'react';
import Link from 'next/link';
import { CommonIssue } from '@/constants/helpDocs';

interface CommonIssueCardProps {
  issue: CommonIssue;
}

const CommonIssueCard: React.FC<CommonIssueCardProps> = ({ issue }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
      <h3 className="text-lg font-semibold mb-3">{issue.question}</h3>
      <p className="text-gray-600 mb-4">{issue.answer}</p>
      
      {issue.relatedTopics.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Related topics:</p>
          <div className="flex flex-wrap gap-2">
            {issue.relatedTopics.map((topic, index) => (
              <Link 
                key={index}
                href={`/docs/${topic}`}
                className="text-xs bg-shop_light_bg text-shop_dark_green px-3 py-1 rounded-full hover:bg-shop_light_bg/80 transition-colors"
              >
                {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonIssueCard; 