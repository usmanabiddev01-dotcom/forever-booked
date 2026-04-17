'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MetaAd {
  id: number;
  campaign_name: string;
  headline: string;
  objective: string;
  status: string;
  thumbnail_url?: string;
  meta_sync_status?: string;
  meta_campaign_id?: string;
}

export default function ViewMetaAds() {
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/ads');
      
      // Check if response is ok before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }
      
      const result = await response.json();

      if (result.success) {
        setAds(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Unable to connect to database');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getThumbnailUrl = (ad: MetaAd) => {
    if (ad.thumbnail_url) return ad.thumbnail_url;
    return null; // Return null to show fallback div instead
  };

  const getThumbnailColor = (ad: MetaAd) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
    return colors[ad.id % colors.length];
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Connection Issue</h2>
                  <p className="text-gray-600">We couldn't connect to the database</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Possible reasons:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Database table hasn't been created yet. Run the SQL in <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">schema.sql</code></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Environment variables not configured. Check <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">.env.local</code></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Database connection credentials are incorrect</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Quick Fix</h4>
                    <p className="text-sm text-blue-800">
                      Check <code className="px-1.5 py-0.5 bg-blue-100 rounded text-xs">DATABASE_SETUP.md</code> for setup instructions, 
                      then try creating your first campaign to test the connection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/create"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Create Your First Campaign
                </Link>
                <button
                  onClick={fetchAds}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Setup Instructions
            </h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 flex-shrink-0">1.</span>
                <span>Go to your Supabase dashboard and run the SQL in <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">schema.sql</code></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 flex-shrink-0">2.</span>
                <span>Add your Supabase anon key to <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">.env.local</code></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 flex-shrink-0">3.</span>
                <span>Restart the development server</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 flex-shrink-0">4.</span>
                <span>Return here and click "Try Again" or create your first campaign</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meta Ad Campaigns</h1>
          <p className="text-gray-600">Browse and manage all your advertising campaigns.</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              All Campaigns ({ads.length})
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Active
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Paused
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Completed
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search campaigns..."
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative aspect-video bg-gray-100">
                  {getThumbnailUrl(ad) ? (
                    <img
                      src={getThumbnailUrl(ad)!}
                      alt={ad.campaign_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide image on error and show the parent div's background
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full ${getThumbnailColor(ad)} flex items-center justify-center p-6`}>
                      <div className="text-center">
                        <div className="text-white text-lg font-bold mb-2">
                          {ad.campaign_name.substring(0, 30)}
                        </div>
                        <div className="text-white/80 text-sm">
                          {ad.objective.charAt(0).toUpperCase() + ad.objective.slice(1)}
                        </div>
                      </div>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ad.status
                    )}`}
                  >
                    {ad.status}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ad.campaign_name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="capitalize">{ad.objective}</span>
                    </div>
                    {ad.meta_sync_status && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        ad.meta_sync_status === 'Synced' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ad.meta_sync_status === 'Synced' ? '🔄 Meta Synced' : '📋 Local Only'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-16 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Campaigns Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Get started by creating your first Meta ad campaign. Launch targeted ads and reach your audience effectively.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Campaign
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
              <div className="bg-white p-6 text-center">
                <p className="text-3xl font-bold text-blue-600 mb-1">01</p>
                <p className="text-sm font-medium text-gray-900 mb-1">Fill the Form</p>
                <p className="text-xs text-gray-600">Add campaign details</p>
              </div>
              <div className="bg-white p-6 text-center">
                <p className="text-3xl font-bold text-purple-600 mb-1">02</p>
                <p className="text-sm font-medium text-gray-900 mb-1">Submit Campaign</p>
                <p className="text-xs text-gray-600">Save to database</p>
              </div>
              <div className="bg-white p-6 text-center">
                <p className="text-3xl font-bold text-green-600 mb-1">03</p>
                <p className="text-sm font-medium text-gray-900 mb-1">Track Results</p>
                <p className="text-xs text-gray-600">View all campaigns</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
