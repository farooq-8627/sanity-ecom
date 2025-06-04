import React from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { aboutUsContent } from "@/constants/quickLinks";
import IconWrapper from "@/components/IconWrapper";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Agorazo",
  description: "Learn about our story, mission, vision, and the team behind Agorazo.",
};

const AboutPage = () => {
  return (
    <>
      <PageHero 
        title={aboutUsContent.heading} 
        description={aboutUsContent.description} 
      />
      
      <Container className="py-16">
        {/* Mission, Vision, Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {aboutUsContent.sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              {section.icon && (
                <div className="mb-4 bg-shop_light_bg rounded-full p-3 w-14 h-14 flex items-center justify-center">
                  <IconWrapper 
                    icon={section.icon} 
                    size={24} 
                    className="text-shop_dark_green" 
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
        
        {/* Company Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023, Agorazo started with a simple idea: to create an online shopping experience that truly puts customers first. What began as a small operation has grown into a trusted e-commerce destination.
            </p>
            <p className="text-gray-600 mb-4">
              Our founder's vision was to build a platform that combines quality products, competitive prices, and exceptional customer service. Today, we continue to be guided by these principles as we expand our product range and reach new customers.
            </p>
            <p className="text-gray-600">
              We're proud of how far we've come, but we're even more excited about where we're going. As we grow, we remain committed to our core values and to providing the best possible shopping experience for our customers.
            </p>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-shop_dark_green/20 to-transparent z-10"></div>
            <Image 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop" 
              alt="Our team working together" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-shop_light_bg rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-shop_dark_green mb-2">10k+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-shop_dark_green mb-2">5k+</p>
              <p className="text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-shop_dark_green mb-2">15+</p>
              <p className="text-gray-600">Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-shop_dark_green mb-2">24/7</p>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AboutPage; 