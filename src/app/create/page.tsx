'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const generateRandomCampaignData = () => {
  const campaignTypes = [
    'Summer Sale', 'Holiday Special', 'Brand Launch', 'Product Showcase', 
    'Season Kickoff', 'Flash Deal', 'New Collection', 'Grand Opening',
    'Clearance Event', 'Limited Time Offer', 'Spring Collection', 'Winter Promo'
  ];
  
  const objectives = ['awareness', 'traffic', 'engagement', 'leads', 'sales'];
  
  const audiences = [
    'Age 18-35, United States, Interested in Technology',
    'Age 25-45, Global, Fitness Enthusiasts',
    'Age 30-50, Europe, Business Professionals',
    'Age 20-40, North America, Fashion Lovers',
    'Age 35-55, United Kingdom, Home Decor Enthusiasts',
    'Age 22-38, Australia, Travel Enthusiasts',
  ];
  
  const headlines = [
    'Transform Your Business Today',
    'Discover Amazing Deals Now',
    'Limited Time Offer - Don\'t Miss Out',
    'Elevate Your Lifestyle',
    'The Future Starts Here',
    'Unlock Exclusive Benefits',
    'Experience Excellence',
    'Your Success Story Begins',
  ];
  
  const descriptions = [
    'Join thousands of satisfied customers who have transformed their lives with our innovative solutions. Limited time special pricing available.',
    'Discover premium quality products designed to exceed your expectations. Shop now and enjoy exclusive member benefits.',
    'Revolutionary features meet unbeatable value. Experience the difference that quality makes in your daily routine.',
    'From concept to reality - we bring your vision to life with cutting-edge technology and expert craftsmanship.',
    'Elevate your experience with our handpicked selection of premium offerings. Satisfaction guaranteed or your money back.',
  ];
  
  const ctas = ['learn_more', 'shop_now', 'sign_up', 'download', 'contact_us', 'get_quote'];
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + Math.floor(Math.random() * 7));
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 15 + Math.floor(Math.random() * 30));
  
  const randomCampaign = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  
  return {
    campaignName: `${randomCampaign} Campaign ${randomNumber}`,
    objective: objectives[Math.floor(Math.random() * objectives.length)],
    budget: (Math.floor(Math.random() * 450) + 50).toString(),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    targetAudience: audiences[Math.floor(Math.random() * audiences.length)],
    adCopy: '',
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    callToAction: ctas[Math.floor(Math.random() * ctas.length)],
  };
};

export default function CreateMetaAd() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    campaignName: '',
    objective: 'awareness',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    adCopy: '',
    headline: '',
    description: '',
    callToAction: 'learn_more',
  });

  useEffect(() => {
    setMounted(true);
    setFormData(generateRandomCampaignData());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
        
        if (result.metaSynced) {
          console.log('Campaign synced to Meta successfully');
        }
      } else {
        setErrorMessage(result.error || 'Failed to create campaign');
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error('Error creating ad:', error);
      setErrorMessage(error.message || 'An error occurred while creating the campaign');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/ads');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-green-50">Your campaign has been created</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 mb-6">
                Your Meta ad campaign <span className="font-semibold">"{formData.campaignName}"</span> has been successfully created and saved.
              </p>
              <button
                onClick={handleSuccessClose}
                className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg cursor-pointer"
              >
                View All Campaigns
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
              <p className="text-red-50">Campaign creation failed</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 bg-gray-50 min-h-full">
        <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Meta Ad Campaign</h1>
          <p className="text-gray-600">Fill in the details below to create your new advertising campaign.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-900 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                required
                value={formData.campaignName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                placeholder="Enter campaign name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="objective" className="block text-sm font-medium text-gray-900 mb-2">
                  Campaign Objective *
                </label>
                <select
                  id="objective"
                  name="objective"
                  required
                  value={formData.objective}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                >
                  <option value="awareness">Brand Awareness</option>
                  <option value="traffic">Traffic</option>
                  <option value="engagement">Engagement</option>
                  <option value="leads">Lead Generation</option>
                  <option value="sales">Sales</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-2">
                  Daily Budget (USD) *
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  required
                  min="1"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-900 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-900 mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                required
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                placeholder="e.g., Age 25-45, United States, Interested in technology"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Creative</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="headline" className="block text-sm font-medium text-gray-900 mb-2">
                    Headline *
                  </label>
                  <input
                    type="text"
                    id="headline"
                    name="headline"
                    required
                    maxLength={100}
                    value={formData.headline}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                    placeholder="Your compelling headline"
                  />
                  <p className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                    {mounted ? `${formData.headline.length}/100 characters` : '0/100 characters'}
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    maxLength={500}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-gray-900 bg-white"
                    placeholder="Write a compelling description for your ad"
                  />
                  <p className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                    {mounted ? `${formData.description.length}/500 characters` : '0/500 characters'}
                  </p>
                </div>

                <div>
                  <label htmlFor="callToAction" className="block text-sm font-medium text-gray-900 mb-2">
                    Call to Action *
                  </label>
                  <select
                    id="callToAction"
                    name="callToAction"
                    required
                    value={formData.callToAction}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                  >
                    <option value="learn_more">Learn More</option>
                    <option value="shop_now">Shop Now</option>
                    <option value="sign_up">Sign Up</option>
                    <option value="download">Download</option>
                    <option value="contact_us">Contact Us</option>
                    <option value="get_quote">Get Quote</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </button>
              <button
                type="button"
                onClick={() => setFormData(generateRandomCampaignData())}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Generate New Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
