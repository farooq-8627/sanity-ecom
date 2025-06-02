import React from 'react';

interface ProductVariantDisplayProps {
  variant: any; // Using any type since we need to handle different formats
}

const ProductVariantDisplay: React.FC<ProductVariantDisplayProps> = ({ variant }) => {
  // Handle case when variant is a reference object
  if (variant && typeof variant === 'object' && '_ref' in variant) {
    return <span>Custom</span>; // Or any default text when it's a reference
  }
  
  // Handle case when variant is a string
  if (typeof variant === 'string') {
    return <span>{variant}</span>;
  }
  
  // Fallback for any other case
  return <span>Unknown</span>;
};

export default ProductVariantDisplay; 