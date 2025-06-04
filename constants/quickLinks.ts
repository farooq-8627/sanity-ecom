// Quick Links Data Structure
export interface QuickLinkContent {
  title: string;
  heading: string;
  description: string;
  sections: {
    title: string;
    content: string;
    icon?: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
}

export const aboutUsContent: QuickLinkContent = {
  title: "About Us",
  heading: "Our Story",
  description: "At Agorazo, we believe in delivering quality products that enhance your lifestyle. Our journey began with a simple idea: to create an online shopping experience that combines convenience, quality, and exceptional customer service.",
  sections: [
    {
      title: "Our Mission",
      content: "To provide high-quality products that enhance our customers' lives while offering exceptional service and value. We strive to make online shopping a seamless and enjoyable experience for everyone.",
      icon: "Target",
    },
    {
      title: "Our Vision",
      content: "To become the leading e-commerce platform known for product quality, customer satisfaction, and innovation in the online shopping experience.",
      icon: "Eye",
    },
    {
      title: "Our Values",
      content: "Quality, Integrity, Customer Focus, Innovation, and Sustainability guide everything we do. We believe in building lasting relationships with our customers based on trust and exceptional service.",
      icon: "Heart",
    },
    {
      title: "Our Team",
      content: "Our diverse team of professionals is passionate about delivering the best shopping experience. From product curation to customer service, our team works tirelessly to ensure your satisfaction.",
      icon: "Users",
    }
  ]
};

export const contactUsContent: QuickLinkContent = {
  title: "Contact Us",
  heading: "Get in Touch",
  description: "We're here to help! Whether you have a question about our products, your order, or anything else, our team is ready to assist you.",
  sections: [
    {
      title: "Customer Support",
      content: "Our dedicated customer support team is available to assist you with any questions or concerns.",
      icon: "HeadsetHelp",
    },
    {
      title: "Sales Inquiries",
      content: "Interested in bulk orders or business partnerships? Our sales team is ready to discuss opportunities.",
      icon: "Store",
    },
    {
      title: "Technical Support",
      content: "Having trouble with our website or app? Our technical team can help resolve any issues.",
      icon: "Wrench",
    }
  ],
  contactInfo: {
    email: "support@agorazo.com",
    phone: "+91 9123456789",
    address: "Visakhapatnam, India",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM IST"
  }
};

export const termsContent: QuickLinkContent = {
  title: "Terms & Conditions",
  heading: "Terms and Conditions",
  description: "Please read these terms and conditions carefully before using our website and services. By accessing or using our platform, you agree to be bound by these terms.",
  sections: [
    {
      title: "Use of the Website",
      content: "You may use our website for lawful purposes and in accordance with these Terms. You agree not to use our website in any way that violates any applicable local, state, national, or international law or regulation.",
    },
    {
      title: "Account Registration",
      content: "To access certain features of our website, you may be required to register for an account. You agree to provide accurate information and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials.",
    },
    {
      title: "Intellectual Property",
      content: "All content on this website, including text, graphics, logos, images, and software, is the property of Agorazo and is protected by copyright and other intellectual property laws.",
    },
    {
      title: "Product Information",
      content: "We strive to provide accurate product descriptions and pricing information. However, we do not warrant that product descriptions or other content on the site is accurate, complete, reliable, current, or error-free.",
    },
    {
      title: "Shipping and Delivery",
      content: "Shipping times and costs are provided at checkout. We are not responsible for delays due to customs or other factors outside our control.",
    }
  ]
};

export const privacyContent: QuickLinkContent = {
  title: "Privacy Policy",
  heading: "Privacy Policy",
  description: "Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.",
  sections: [
    {
      title: "Information We Collect",
      content: "We collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products, or otherwise contact us. This information may include your name, email address, postal address, phone number, and payment information.",
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you marketing communications, and to respond to your inquiries.",
    },
    {
      title: "Information Sharing",
      content: "We may share your information with third-party service providers to help us operate our business, such as payment processors and shipping companies. We do not sell your personal information to third parties.",
    },
    {
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.",
    },
    {
      title: "Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to track activity on our website and to hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
    }
  ]
};

export const faqsContent: QuickLinkContent = {
  title: "FAQs",
  heading: "Frequently Asked Questions",
  description: "Find answers to commonly asked questions about our products, ordering process, shipping, returns, and more.",
  sections: [],
  faqs: [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. International shipping can take 7-14 business days depending on the destination country and customs processing."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused, in their original packaging, and in resalable condition. Some exceptions apply for hygiene products and special orders."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account on our website to view order status and tracking details."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Import duties and taxes may apply and are the responsibility of the customer."
    },
    {
      question: "How do I change or cancel my order?",
      answer: "You can request changes or cancellations within 1 hour of placing your order by contacting our customer service team. After this window, we may not be able to modify orders that have entered processing."
    },
    {
      question: "Are my payment details secure?",
      answer: "Yes, we use industry-standard encryption and secure payment processors to ensure your payment information is protected. We do not store your full credit card details on our servers."
    },
    {
      question: "Do you offer discounts for bulk orders?",
      answer: "Yes, we offer special pricing for bulk orders. Please contact our sales team for a custom quote based on your specific requirements."
    }
  ]
};

export const helpContent: QuickLinkContent = {
  title: "Help",
  heading: "Help Center",
  description: "Need assistance? Our help center provides resources and guidance to make your shopping experience smooth and enjoyable.",
  sections: [
    {
      title: "Getting Started",
      content: "New to Agorazo? Learn how to create an account, browse products, and make your first purchase with our step-by-step guides.",
      icon: "Rocket",
    },
    {
      title: "Ordering & Payment",
      content: "Find information about the ordering process, payment methods, gift cards, and promotional codes.",
      icon: "CreditCard",
    },
    {
      title: "Shipping & Delivery",
      content: "Learn about shipping options, delivery timeframes, tracking your package, and international shipping policies.",
      icon: "Truck",
    },
    {
      title: "Returns & Refunds",
      content: "Understand our return policy, how to initiate a return, and the refund process.",
      icon: "RefreshCcw",
    },
    {
      title: "Account Management",
      content: "Get help with managing your account, updating your information, and viewing order history.",
      icon: "UserCog",
    }
  ]
};

// Export all quick links content
export const quickLinksPages = {
  about: aboutUsContent,
  contact: contactUsContent,
  terms: termsContent,
  privacy: privacyContent,
  faqs: faqsContent,
  help: helpContent
}; 