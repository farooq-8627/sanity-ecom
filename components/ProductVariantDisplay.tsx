import React from 'react';

interface ProductVariantDisplayProps {
  variant: any; // Using any type since we need to handle different formats
}

const ProductVariantDisplay: React.FC<ProductVariantDisplayProps> = ({ variant }) => {
  // Handle null or undefined
  if (!variant) {
    return <span>Standard</span>;
  }
  
  // Handle case when variant is a reference object
  if (variant && typeof variant === 'object' && '_ref' in variant) {
    return <span>Custom</span>; // Or any default text when it's a reference
  }
  
  // Handle case when variant is an object with title/value
  if (variant && typeof variant === 'object') {
    if (variant.title) {
      return <span>{variant.title}</span>;
    }
    if (variant.value) {
      return <span>{variant.value}</span>;
    }
  }
  
  // Handle case when variant is a string
  if (typeof variant === 'string') {
    return <span>{variant}</span>;
  }
  
  // Fallback for any other case
  return <span>Standard</span>;
};

export default ProductVariantDisplay; 