// Website Configuration
export const siteConfig = {
  // Basic Site Info
  name: "Agorazo", // Replace 'Shopcart' with your site name
  logo: {
    text: "Agora", // First part of the logo text
    highlight: "zo", // Highlighted part of the logo text (e.g., the 't' in 'Shopcart')
  },
  description: "Your one-stop destination for quality products at affordable prices",
  
  // SEO and Metadata
  seo: {
    title: "Agorazo online store", // Default title
    titleTemplate: "%s - Agorazo online store", // %s will be replaced with page title
    description: "Agorazo online store, Your one stop shop for all your needs",
    keywords: "ecommerce, online shopping, products, fashion, electronics, home goods",
    // Use a data URL to avoid image component issues
    ogImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'%3E%3Crect width='1200' height='630' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='64' font-weight='bold' fill='%23212529'%3EAgorazo%3C/text%3E%3C/svg%3E",
    twitterHandle: "@agorazo",
  },
  
  // Contact Information
  contact: {
    email: "info@agorazo.com",
    phone: "+91 9123456789",
    address: "Visakhapatnam, India",
    workingHours: "Mon - Sat: 10:00 AM - 7:00 PM",
  },
  
  // Social Media Links
  socialMedia: [
    { title: "Youtube", href: "https://www.youtube.com/agorazo", icon: "Youtube" },
    { title: "Github", href: "https://www.github.com/agorazo", icon: "Github" },
    { title: "Linkedin", href: "https://www.linkedin.com/company/agorazo", icon: "Linkedin" },
    { title: "Facebook", href: "https://www.facebook.com/agorazo", icon: "Facebook" },
    { title: "Instagram", href: "https://www.instagram.com/agorazo", icon: "Instagram" },
  ],
  
  // Company Information
  company: {
    name: "Agorazo Inc.",
    foundedYear: 2023,
    about: "Discover curated collections at Agorazo, blending style and comfort to elevate your living spaces.",
    mission: "To provide high-quality products that enhance our customers' lives while offering exceptional service and value.",
  },
  
  // Legal
  legal: {
    copyright: `© ${new Date().getFullYear()} Agorazo. All rights reserved.`,
    privacyPolicy: "/privacy",
    termsOfService: "/terms",
  }
};

// Navigation Links
export const headerData = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Reels", href: "/reels" },
  { title: "Blog", href: "/blog" },
  { title: "Hot Deal", href: "/deal" },
  { title: "Contact", href: "/contact" },
];

export const quickLinksData = [
  { title: "About us", href: "/about" },
  { title: "Contact us", href: "/contact" },
  { title: "Terms & Conditions", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "FAQs", href: "/faqs" },
];

export const productType = [
  { title: "Fashion", value: "fashion" },
  { title: "Electronics", value: "electronics" },
  { title: "Home & Kitchen", value: "home-kitchen" },
  { title: "Beauty & Personal Care", value: "beauty-personal-care" },
  { title: "Sports & Outdoors", value: "sports-outdoors" },
  { title: "Toys & Games", value: "toys-games" },
  { title: "Others", value: "others" },
];

// Payment methods supported
export const paymentMethods = [
  { name: "Visa", image: "/images/payments/visa.png" },
  { name: "Mastercard", image: "/images/payments/mastercard.png" },
  { name: "PayPal", image: "/images/payments/paypal.png" },
  { name: "Apple Pay", image: "/images/payments/apple-pay.png" },
];

// Shipping information
export const shippingInfo = {
  freeShippingThreshold: 50, // Free shipping for orders over $50
  standardShipping: 5.99,
  expressShipping: 12.99,
  internationalShipping: 25.99,
  estimatedDelivery: "3-5 business days",
};
