import React from 'react';
import Link from 'next/link';
import { HelpDocTopic } from '@/constants/helpDocs';
import { cn } from '@/lib/utils';

interface DocSidebarProps {
  topics: HelpDocTopic[];
  currentTopicId?: string;
}

const DocSidebar: React.FC<DocSidebarProps> = ({ 
  topics, 
  currentTopicId 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Documentation</h3>
      <nav>
        <ul className="space-y-1">
          <li>
            <Link 
              href="/docs"
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium",
                !currentTopicId 
                  ? "bg-shop_light_bg text-shop_dark_green" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Overview
            </Link>
          </li>
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link 
                href={`/docs/${topic.id}`}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium",
                  currentTopicId === topic.id 
                    ? "bg-shop_light_bg text-shop_dark_green" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {topic.title}
              </Link>
              
              {currentTopicId === topic.id && topic.sections.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1">
                  {topic.sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`}
                        className="block px-3 py-1.5 text-xs text-gray-500 hover:text-shop_dark_green rounded-md hover:bg-gray-50"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link 
              href="/docs/common-issues"
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium",
                currentTopicId === "common-issues" 
                  ? "bg-shop_light_bg text-shop_dark_green" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Common Issues
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DocSidebar; 