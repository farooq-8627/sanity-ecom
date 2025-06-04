import React from "react";
import Container from "./Container";

interface PageHeroProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, description, className }) => {
  return (
    <div className={`bg-gradient-to-r from-shop_light_bg to-white py-12 md:py-20 ${className}`}>
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">{title}</h1>
          {description && (
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PageHero; 