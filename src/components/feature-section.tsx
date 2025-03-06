
import React from "react";
import { GlowUpHeading } from "@/components/ui/glow-up-heading";
import { GlowUpCard } from "@/components/ui/glow-up-card";

const FeatureSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 mb-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 7.5V6.75C21 5.50736 19.9926 4.5 18.75 4.5H5.25C4.00736 4.5 3 5.50736 3 6.75V17.25C3 18.4926 4.00736 19.5 5.25 19.5H18.75C19.9926 19.5 21 18.4926 21 17.25V16.5M12 15L16.5 10.5M16.5 10.5H12.75M16.5 10.5V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Automatic Effect Detection",
      description: "Our AI analyzes your video to find the perfect spots for effects, based on movement, audio, and pacing."
    },
    {
      icon: (
        <svg className="w-8 h-8 mb-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5827 15.5833L19.4993 19.5M17.9993 11.0833C17.9993 14.5395 15.206 17.3333 11.7493 17.3333C8.29269 17.3333 5.49935 14.5395 5.49935 11.0833C5.49935 7.62715 8.29269 4.83333 11.7493 4.83333C15.206 4.83333 17.9993 7.62715 17.9993 11.0833Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "AI-Enhanced Gestures",
      description: "Add hand waves, reactions, and gestures that perfectly match your video's timing and tone."
    },
    {
      icon: (
        <svg className="w-8 h-8 mb-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 16L12.5 13M12.5 13L15.5 16M12.5 13V20M7 17.8C5.9 17.8 5.01 16.91 5.01 15.8C5.01 14.79 5.75 13.96 6.74 13.82C6.87 12.29 7.96 11 9.5 11C9.77 11 10.04 11.04 10.29 11.12C10.82 9.88 12.06 9 13.5 9C15.43 9 17 10.57 17 12.5C17 12.55 17 12.6 16.99 12.65C18.16 12.99 19 14.08 19 15.39C19 16.93 17.74 18.19 16.2 18.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "One-Click Sharing",
      description: "Instantly share your enhanced videos across TikTok, Instagram, YouTube, and more."
    },
    {
      icon: (
        <svg className="w-8 h-8 mb-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V9.5M13.5 3L19 8.5M13.5 3V7C13.5 8.38071 14.6193 9.5 16 9.5M19 8.5H16M19 8.5V8.6M9 13H15M9 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Natural Language Editing",
      description: "Just type what you want: "Add sparkles at 3s" and watch the AI implement your vision."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <GlowUpHeading as="h2" className="mb-6">
            AI-Powered Video Enhancement
          </GlowUpHeading>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Our cutting-edge AI transforms ordinary videos into eye-catching content with just a few clicks.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlowUpCard 
              key={index} 
              variant="glass" 
              hoverable 
              className="p-6 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {feature.icon}
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </GlowUpCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FeatureSection };
