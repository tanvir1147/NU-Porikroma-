'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('Checking...');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test API connection
        const apiTest = await fetch('/api/health');
        const apiResult = await apiTest.json();
        
        if (apiResult.message) {
          setStatus('API connection: OK\nDatabase connection: OK');
        } else {
          setError('API connection failed');
        }
      } catch (err) {
        setError('Failed to connect to API: ' + (err as Error).message);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">System Test</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h2 className="font-medium text-blue-800">Status</h2>
          <p className="text-blue-600 whitespace-pre-line">{status}</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h2 className="font-medium text-red-800">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <a 
              href="/admin/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </a>
            <a 
              href="/" 
              className="px-4 py-2 bg-gray-600 text-white rounded-md text-center hover:bg-gray-700 transition-colors"
            >
              Main Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}