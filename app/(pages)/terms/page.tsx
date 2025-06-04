import React from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { termsContent } from "@/constants/quickLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Agorazo",
  description: "Read our terms and conditions to understand your rights and responsibilities when using our services.",
};

const TermsPage = () => {
  return (
    <>
      <PageHero 
        title={termsContent.heading} 
        description={termsContent.description} 
      />
      
      <Container className="py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            {termsContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall Agorazo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Governing Law</h2>
              <p className="text-gray-600">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at <a href="mailto:legal@agorazo.com" className="text-shop_dark_green hover:underline">legal@agorazo.com</a>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TermsPage; 