import React from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { faqsContent } from "@/constants/quickLinks";
import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs | Agorazo",
  description: "Find answers to commonly asked questions about our products and services.",
};

const FAQsPage = () => {
  return (
    <>
      <PageHero 
        title={faqsContent.heading} 
        description={faqsContent.description} 
      />
      
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
            <Accordion type="single" collapsible className="w-full">
              {faqsContent.faqs?.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="bg-shop_light_bg p-8 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please contact our friendly support team.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-shop_dark_green text-white rounded-lg hover:bg-shop_dark_green/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FAQsPage; 