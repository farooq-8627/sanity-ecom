import React from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { privacyContent } from "@/constants/quickLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Agorazo",
  description: "Learn about how we collect, use, and protect your personal information.",
};

const PrivacyPage = () => {
  return (
    <>
      <PageHero 
        title={privacyContent.heading} 
        description={privacyContent.description} 
      />
      
      <Container className="py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Introduction</h2>
              <p className="text-gray-600">
                At Agorazo, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </div>
            
            {privacyContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-gray-600">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@agorazo.com" className="text-shop_dark_green hover:underline">privacy@agorazo.com</a>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PrivacyPage; 