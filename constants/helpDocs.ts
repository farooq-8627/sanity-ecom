// Help Documentation Data Structure
export interface HelpDocSection {
  id: string;
  title: string;
  content: string;
  subSections?: {
    title: string;
    content: string;
  }[];
}

export interface HelpDocTopic {
  id: string;
  title: string;
  description: string;
  icon?: string;
  sections: HelpDocSection[];
}

export const helpDocTopics: HelpDocTopic[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn how to create an account, browse products, and make your first purchase.",
    icon: "Rocket",
    sections: [
      {
        id: "create-account",
        title: "Creating an Account",
        content: "Creating an account with Agorazo is quick and easy. An account allows you to track orders, save your shipping information, and create wishlists for future purchases.",
        subSections: [
          {
            title: "Step 1: Navigate to Sign Up",
            content: "Click on the 'Account' icon in the top right corner of the website and select 'Sign Up' from the dropdown menu."
          },
          {
            title: "Step 2: Enter Your Information",
            content: "Fill in your email address, create a password, and provide your name. You can also sign up using your Google or Facebook account for faster registration."
          },
          {
            title: "Step 3: Verify Your Email",
            content: "Check your email inbox for a verification link from Agorazo. Click the link to verify your account. If you don't see the email, check your spam folder."
          },
          {
            title: "Step 4: Complete Your Profile",
            content: "Add your shipping address, phone number, and payment information to streamline future checkout processes."
          }
        ]
      },
      {
        id: "browsing-products",
        title: "Browsing Products",
        content: "Discover our wide range of products through various browsing options designed to help you find exactly what you're looking for.",
        subSections: [
          {
            title: "Using Categories",
            content: "Browse products by category by clicking on the category links in the navigation menu. You can further refine your search using subcategories."
          },
          {
            title: "Search Functionality",
            content: "Use the search bar at the top of the page to search for specific products by name, brand, or keywords."
          },
          {
            title: "Filtering Options",
            content: "Refine your search results using filters such as price range, color, size, brand, and customer ratings to find products that match your preferences."
          },
          {
            title: "Product Reels",
            content: "Check out our product reels for short video demonstrations of popular items in action."
          }
        ]
      },
      {
        id: "first-purchase",
        title: "Making Your First Purchase",
        content: "Follow these steps to complete your first purchase on Agorazo.",
        subSections: [
          {
            title: "Step 1: Add Products to Cart",
            content: "Click the 'Add to Cart' button on any product page. For products with options like size or color, make your selection first."
          },
          {
            title: "Step 2: Review Your Cart",
            content: "Click the cart icon in the top right corner to review your items. Here you can adjust quantities or remove products if needed."
          },
          {
            title: "Step 3: Proceed to Checkout",
            content: "Click 'Proceed to Checkout' to begin the payment process. If you're not logged in, you'll be prompted to sign in or continue as a guest."
          },
          {
            title: "Step 4: Enter Shipping Information",
            content: "Enter your shipping address or select a saved address if you're logged in."
          },
          {
            title: "Step 5: Choose Shipping Method",
            content: "Select your preferred shipping method from the available options."
          },
          {
            title: "Step 6: Enter Payment Information",
            content: "Choose your payment method and enter the required details. We accept credit/debit cards, PayPal, and other payment options."
          },
          {
            title: "Step 7: Review and Place Order",
            content: "Review your order details, including items, shipping address, and payment information. Click 'Place Order' to complete your purchase."
          }
        ]
      }
    ]
  },
  {
    id: "ordering-payment",
    title: "Ordering & Payment",
    description: "Information about the ordering process, payment methods, gift cards, and promotional codes.",
    icon: "CreditCard",
    sections: [
      {
        id: "payment-methods",
        title: "Payment Methods",
        content: "Agorazo offers various secure payment options to make your shopping experience convenient and safe.",
        subSections: [
          {
            title: "Credit/Debit Cards",
            content: "We accept Visa, Mastercard, American Express, and Discover. Your card information is securely processed and never stored on our servers."
          },
          {
            title: "Digital Wallets",
            content: "Pay using PayPal, Apple Pay, or Google Pay for a faster checkout experience."
          },
          {
            title: "Bank Transfers",
            content: "Direct bank transfers are available for certain order types. Processing may take 1-2 business days."
          },
          {
            title: "Cash on Delivery",
            content: "Available in select regions, this option allows you to pay in cash when your order is delivered."
          }
        ]
      },
      {
        id: "promo-codes",
        title: "Using Promotional Codes",
        content: "Learn how to apply promotional codes to receive discounts on your purchases.",
        subSections: [
          {
            title: "Where to Find Promo Codes",
            content: "Promotional codes can be found in our newsletter, social media pages, or through special promotions sent to registered customers."
          },
          {
            title: "How to Apply a Promo Code",
            content: "During checkout, enter your promo code in the 'Discount Code' field and click 'Apply'. The discount will be automatically calculated and applied to your order total."
          },
          {
            title: "Promo Code Restrictions",
            content: "Some promotional codes may have restrictions, such as minimum purchase amounts, specific product categories, or expiration dates. These details will be provided with the code."
          }
        ]
      },
      {
        id: "gift-cards",
        title: "Gift Cards",
        content: "Purchase and redeem gift cards for yourself or as presents for friends and family.",
        subSections: [
          {
            title: "Purchasing Gift Cards",
            content: "Gift cards can be purchased in denominations from ₹500 to ₹10,000. Digital gift cards are delivered via email, while physical gift cards can be shipped to the recipient's address."
          },
          {
            title: "Redeeming Gift Cards",
            content: "To redeem a gift card, enter the gift card code during checkout in the 'Gift Card' field and click 'Apply'. The balance will be applied to your order."
          },
          {
            title: "Checking Gift Card Balance",
            content: "Check your gift card balance by visiting the 'Gift Card Balance' page and entering your gift card number and PIN."
          }
        ]
      },
      {
        id: "order-processing",
        title: "Order Processing",
        content: "Understand how your order is processed from the moment you place it until it's shipped.",
        subSections: [
          {
            title: "Order Confirmation",
            content: "After placing an order, you'll receive an order confirmation email with your order number and details."
          },
          {
            title: "Payment Verification",
            content: "Your payment is verified before processing begins. This typically takes a few minutes but may take longer in some cases."
          },
          {
            title: "Order Preparation",
            content: "Once payment is verified, your order is sent to our warehouse for preparation. Items are carefully picked and packed for shipping."
          },
          {
            title: "Shipping",
            content: "When your order is ready, it's handed over to our shipping partner. You'll receive a shipping confirmation email with tracking information."
          }
        ]
      }
    ]
  },
  {
    id: "shipping-delivery",
    title: "Shipping & Delivery",
    description: "Learn about shipping options, delivery timeframes, tracking your package, and international shipping policies.",
    icon: "Truck",
    sections: [
      {
        id: "shipping-options",
        title: "Shipping Options",
        content: "Choose from various shipping options to suit your needs and budget.",
        subSections: [
          {
            title: "Standard Shipping",
            content: "Delivery within 3-5 business days. Free for orders over ₹1000, otherwise ₹100 for domestic orders."
          },
          {
            title: "Express Shipping",
            content: "Delivery within 1-2 business days. Available for ₹250 for domestic orders."
          },
          {
            title: "Same-Day Delivery",
            content: "Available in select cities for orders placed before 12 PM. Additional charges apply."
          },
          {
            title: "International Shipping",
            content: "Delivery times vary by destination country, typically 7-14 business days. Shipping costs are calculated based on weight and destination."
          }
        ]
      },
      {
        id: "tracking-orders",
        title: "Tracking Your Order",
        content: "Stay updated on your order's status and location throughout the delivery process.",
        subSections: [
          {
            title: "Order Status Updates",
            content: "You'll receive email and/or SMS notifications at key stages of your order: confirmation, processing, shipping, and delivery."
          },
          {
            title: "Using the Tracking Number",
            content: "Click the tracking number in your shipping confirmation email or log into your account and go to 'Order History' to track your package."
          },
          {
            title: "Tracking Issues",
            content: "If your tracking information hasn't updated for more than 48 hours, please contact our customer support team for assistance."
          }
        ]
      },
      {
        id: "delivery-information",
        title: "Delivery Information",
        content: "Important details about receiving your order.",
        subSections: [
          {
            title: "Delivery Attempts",
            content: "Our shipping partners will attempt delivery up to three times. If no one is available to receive the package, a delivery notice will be left with instructions for rescheduling or pickup."
          },
          {
            title: "Signature Requirement",
            content: "Orders valued over ₹5000 require a signature upon delivery. You can also request signature confirmation for any order during checkout."
          },
          {
            title: "Delivery to Apartments/Buildings",
            content: "Please provide any necessary access codes or delivery instructions during checkout to ensure smooth delivery to apartments or secured buildings."
          }
        ]
      },
      {
        id: "international-shipping",
        title: "International Shipping",
        content: "Information for customers ordering from outside India.",
        subSections: [
          {
            title: "Countries We Ship To",
            content: "We currently ship to over 50 countries worldwide. Check our International Shipping page for the complete list."
          },
          {
            title: "Customs and Import Duties",
            content: "International orders may be subject to customs fees and import duties imposed by the destination country. These fees are the responsibility of the customer and are not included in our shipping charges."
          },
          {
            title: "International Delivery Times",
            content: "Delivery times for international orders typically range from 7-14 business days but may vary depending on customs processing and local delivery conditions."
          },
          {
            title: "Restricted Items",
            content: "Some products may not be available for international shipping due to export restrictions or regulations in certain countries."
          }
        ]
      }
    ]
  },
  {
    id: "returns-refunds",
    title: "Returns & Refunds",
    description: "Understand our return policy, how to initiate a return, and the refund process.",
    icon: "RefreshCcw",
    sections: [
      {
        id: "return-policy",
        title: "Return Policy",
        content: "Our customer-friendly return policy ensures your satisfaction with every purchase.",
        subSections: [
          {
            title: "Return Eligibility",
            content: "Most items can be returned within 30 days of delivery. Products must be unused, in their original packaging, and in resalable condition. Some exceptions apply for hygiene products, perishable goods, and custom-made items."
          },
          {
            title: "Return Reasons",
            content: "Valid reasons for returns include damaged items, defective products, incorrect items received, or if you're simply not satisfied with your purchase."
          },
          {
            title: "Non-Returnable Items",
            content: "Certain items cannot be returned, including personal hygiene products, undergarments, swimwear, food items, and products with broken seals on software or electronics."
          }
        ]
      },
      {
        id: "initiating-return",
        title: "How to Initiate a Return",
        content: "Follow these steps to start the return process for your order.",
        subSections: [
          {
            title: "Step 1: Log Into Your Account",
            content: "Sign in to your Agorazo account and go to 'Order History'. Find the order containing the item you wish to return."
          },
          {
            title: "Step 2: Select Return Option",
            content: "Click on 'Return Item' next to the product you want to return. Select the reason for your return and provide any additional information if requested."
          },
          {
            title: "Step 3: Print Return Label",
            content: "Download and print the return shipping label provided. If you don't have a printer, you can request to have a return label emailed to you."
          },
          {
            title: "Step 4: Package the Item",
            content: "Place the item in its original packaging or a suitable box. Include all accessories, manuals, and free gifts that came with the product."
          },
          {
            title: "Step 5: Ship the Return",
            content: "Attach the return label to your package and drop it off at the designated shipping carrier location. Keep your return tracking number for reference."
          }
        ]
      },
      {
        id: "refund-process",
        title: "Refund Process",
        content: "Learn how and when you'll receive your refund after returning an item.",
        subSections: [
          {
            title: "Refund Timeline",
            content: "Once we receive your return, it takes 2-3 business days to inspect the item and process your refund. The refund will be issued to your original payment method within 5-7 business days, depending on your bank or payment provider."
          },
          {
            title: "Refund Methods",
            content: "Refunds are processed to the original payment method used for the purchase. If you paid by credit card, the refund will be credited back to the same card. For other payment methods, we may issue store credit if a direct refund isn't possible."
          },
          {
            title: "Partial Refunds",
            content: "Partial refunds may be issued if returned items show signs of use, damage, or missing parts. You'll be notified before a partial refund is processed."
          },
          {
            title: "Refund for Shipping Costs",
            content: "Original shipping charges are refunded only if the return is due to our error (wrong item shipped, defective product, etc.). Return shipping costs are covered by Agorazo only in cases of defective or incorrectly shipped items."
          }
        ]
      },
      {
        id: "exchanges",
        title: "Exchanges",
        content: "If you'd prefer to exchange an item rather than return it for a refund, follow these guidelines.",
        subSections: [
          {
            title: "Requesting an Exchange",
            content: "During the return process, select 'Exchange' instead of 'Return' and specify the replacement item you want (size, color, etc.)."
          },
          {
            title: "Exchange Availability",
            content: "Exchanges are subject to product availability. If the requested replacement is out of stock, we'll issue a refund instead."
          },
          {
            title: "Exchange Shipping",
            content: "For size or color exchanges of the same product, we'll ship the replacement item at no additional cost. For exchanges to different products, standard shipping charges may apply."
          }
        ]
      }
    ]
  },
  {
    id: "account-management",
    title: "Account Management",
    description: "Get help with managing your account, updating your information, and viewing order history.",
    icon: "UserCog",
    sections: [
      {
        id: "account-settings",
        title: "Managing Account Settings",
        content: "Learn how to update and maintain your account information.",
        subSections: [
          {
            title: "Updating Personal Information",
            content: "To update your name, email, or phone number, go to 'My Account' and select 'Personal Information'. Make your changes and click 'Save Changes'."
          },
          {
            title: "Changing Your Password",
            content: "Go to 'My Account', select 'Security', then 'Change Password'. Enter your current password followed by your new password and confirm the changes."
          },
          {
            title: "Managing Addresses",
            content: "Add, edit, or remove shipping and billing addresses in the 'Addresses' section of your account. You can set a default address for faster checkout."
          },
          {
            title: "Communication Preferences",
            content: "Manage your email subscription preferences, including newsletters and promotional emails, in the 'Communication Preferences' section."
          }
        ]
      },
      {
        id: "order-history",
        title: "Viewing Order History",
        content: "Access and manage your past and current orders.",
        subSections: [
          {
            title: "Accessing Order History",
            content: "Go to 'My Account' and select 'Order History' to view all your past orders. Click on any order number to see detailed information."
          },
          {
            title: "Order Details",
            content: "Each order page shows the items purchased, prices, shipping information, payment method, and current status."
          },
          {
            title: "Reordering Items",
            content: "From your order history, you can easily reorder items by clicking 'Buy Again' next to any product in your past orders."
          },
          {
            title: "Downloading Invoices",
            content: "Access and download invoices for your orders by clicking 'View Invoice' on the order details page."
          }
        ]
      },
      {
        id: "wishlists",
        title: "Creating and Managing Wishlists",
        content: "Save products for future purchases with wishlists.",
        subSections: [
          {
            title: "Creating a Wishlist",
            content: "Click the heart icon on any product page to add it to your wishlist. You can create multiple wishlists for different categories or occasions."
          },
          {
            title: "Managing Wishlist Items",
            content: "Go to 'My Account' and select 'Wishlists' to view and manage your saved items. You can move items between wishlists, remove items, or add them directly to your cart."
          },
          {
            title: "Sharing Wishlists",
            content: "Share your wishlist with friends and family by clicking the 'Share' button and copying the link or sending it via email."
          }
        ]
      },
      {
        id: "account-security",
        title: "Account Security",
        content: "Keep your account secure with these best practices.",
        subSections: [
          {
            title: "Strong Password Guidelines",
            content: "Create a strong password using a combination of uppercase and lowercase letters, numbers, and special characters. Avoid using easily guessable information like birthdays or common words."
          },
          {
            title: "Two-Factor Authentication",
            content: "Enable two-factor authentication in your account security settings for an additional layer of protection. This requires a verification code sent to your phone or email when logging in from a new device."
          },
          {
            title: "Monitoring Account Activity",
            content: "Regularly check your account activity for any unauthorized actions. If you notice suspicious activity, change your password immediately and contact our support team."
          },
          {
            title: "Secure Checkout",
            content: "Always ensure you're on our secure website (https://www.agorazo.com) before entering payment information. We never ask for your full credit card details via email or phone."
          }
        ]
      }
    ]
  }
];

// Common Issues and Solutions
export interface CommonIssue {
  id: string;
  question: string;
  answer: string;
  relatedTopics: string[];
}

export const commonIssues: CommonIssue[] = [
  {
    id: "order-not-arrived",
    question: "My order hasn't arrived yet. What should I do?",
    answer: "If your order hasn't arrived within the expected delivery timeframe, please follow these steps: 1) Check your order status in your account dashboard, 2) Verify the tracking information for any updates, 3) Confirm the delivery address is correct, 4) If it's been more than 2 days past the estimated delivery date, please contact our customer support team with your order number.",
    relatedTopics: ["shipping-delivery", "tracking-orders"]
  },
  {
    id: "wrong-item-received",
    question: "I received the wrong item. How do I get the correct one?",
    answer: "We apologize for the inconvenience. Please initiate a return through your account by selecting 'Wrong item received' as the reason. Take a photo of the incorrect item and include it in your return request. We'll prioritize sending you the correct item as soon as we receive your return request. You don't need to wait for us to receive the wrong item before we ship the correct one.",
    relatedTopics: ["returns-refunds", "initiating-return"]
  },
  {
    id: "damaged-product",
    question: "My product arrived damaged. What should I do?",
    answer: "We're sorry your item arrived damaged. Please take clear photos of the damaged product and packaging, then contact our customer support team within 48 hours of delivery. Include your order number and the photos in your message. We'll arrange for a return and replacement or refund, depending on your preference and product availability.",
    relatedTopics: ["returns-refunds", "initiating-return"]
  },
  {
    id: "cancel-order",
    question: "How do I cancel my order?",
    answer: "You can cancel your order if it hasn't been shipped yet. Go to 'Order History' in your account, find the order you want to cancel, and click 'Cancel Order'. If the cancellation button isn't available, the order is already in the shipping process. In this case, you can refuse the delivery or return the item once received for a refund.",
    relatedTopics: ["order-processing", "returns-refunds"]
  },
  {
    id: "payment-declined",
    question: "My payment was declined. What should I do?",
    answer: "Payment declines can happen for several reasons: insufficient funds, card limits, incorrect information, or bank security measures. First, verify your payment details are correct. Try using a different payment method or contact your bank to ensure there are no restrictions on your card. If the issue persists, please contact our customer support team for assistance.",
    relatedTopics: ["payment-methods", "ordering-payment"]
  },
  {
    id: "promo-code-not-working",
    question: "My promotional code isn't working. Why?",
    answer: "Promotional codes may not work for several reasons: the code might be expired, you may not meet the minimum purchase requirement, the code might be for specific products only, or it may have already been used. Check the terms and conditions of the promotion. If you believe the code should work, please contact our customer support with the code details for assistance.",
    relatedTopics: ["promo-codes", "ordering-payment"]
  },
  {
    id: "size-exchange",
    question: "The size I ordered doesn't fit. Can I exchange it?",
    answer: "Yes, you can exchange items for a different size within 30 days of delivery. Go to 'Order History' in your account, select the order, and click 'Return or Exchange'. Choose 'Exchange' and select the desired size. If the new size is available, we'll ship it once we receive the original item. If the new size is out of stock, we'll issue a refund instead.",
    relatedTopics: ["returns-refunds", "exchanges"]
  },
  {
    id: "track-refund",
    question: "How can I track my refund status?",
    answer: "You can track your refund status in the 'Returns & Refunds' section of your account. Once we receive and process your return, you'll receive an email confirmation that your refund has been issued. The funds typically appear in your account within 5-7 business days, depending on your payment method and financial institution.",
    relatedTopics: ["refund-process", "returns-refunds"]
  },
  {
    id: "international-shipping-time",
    question: "Why is international shipping taking so long?",
    answer: "International shipping times can vary due to several factors: customs processing, which can take 1-7 days depending on the country; local delivery conditions; and potential delays during peak seasons or holidays. You can track your package using the provided tracking number. If there's no update for more than 7 days, please contact our customer support team with your order details.",
    relatedTopics: ["international-shipping", "tracking-orders"]
  },
  {
    id: "account-login-issues",
    question: "I can't log into my account. How can I reset my password?",
    answer: "To reset your password, click 'Forgot Password' on the login page. Enter the email address associated with your account, and we'll send you a password reset link. Check your inbox (and spam folder) for the email and follow the instructions. If you don't receive the email or continue to have issues, please contact our customer support team for assistance.",
    relatedTopics: ["account-settings", "account-security"]
  }
]; 