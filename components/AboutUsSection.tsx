import React from 'react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="mb-12">
      <div className="max-w-3xl mx-auto text-center bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-cyan-400">Meet the Creators</h2>
        <p className="text-gray-300 leading-relaxed text-left md:text-center">
          This app was brought to life by <strong>Richard</strong> and <strong>Darren</strong>, two passionate students from <strong>The City College of New York</strong>.
          We wanted to create a tool that helps people, especially students and working citizens, to take control of their finances. Our goal is to help you budget safely, manage your spending habits effectively, and work towards your financial goals with confidence.
        </p>
      </div>
    </section>
  );
};