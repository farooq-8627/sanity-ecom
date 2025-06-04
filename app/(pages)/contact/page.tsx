import React from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { contactUsContent } from "@/constants/quickLinks";
import IconWrapper from "@/components/IconWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Agorazo",
  description: "Get in touch with our team for any questions, feedback, or support needs.",
};

const ContactPage = () => {
  return (
    <>
      <PageHero 
        title={contactUsContent.heading} 
        description={contactUsContent.description} 
      />
      
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="w-full" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  placeholder="How can we help you?" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Write your message here..." 
                  className="w-full min-h-[150px]" 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto px-8"
              >
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-shop_dark_green mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a href={`mailto:${contactUsContent.contactInfo?.email}`} className="text-shop_dark_green hover:underline">
                      {contactUsContent.contactInfo?.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="text-shop_dark_green mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <a href={`tel:${contactUsContent.contactInfo?.phone}`} className="text-shop_dark_green hover:underline">
                      {contactUsContent.contactInfo?.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="text-shop_dark_green mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-600">{contactUsContent.contactInfo?.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="text-shop_dark_green mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business Hours</p>
                    <p className="text-gray-600">{contactUsContent.contactInfo?.hours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Support Options */}
            {contactUsContent.sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  {section.icon && (
                    <div className="bg-shop_light_bg rounded-full p-2 flex items-center justify-center">
                      <IconWrapper 
                        icon={section.icon} 
                        size={18} 
                        className="text-shop_dark_green" 
                      />
                    </div>
                  )}
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      
      </Container>
    </>
  );
};

export default ContactPage; 