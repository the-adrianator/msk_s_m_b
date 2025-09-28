'use client';

import { useState } from 'react';
import { seedFirestoreData } from '@/scripts/seedData';

export default function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      await seedFirestoreData();
      setMessage('Data seeded successfully!');
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAndReseed = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Note: In a real app, you'd implement proper batch deletion
      setMessage(
        'Please clear data manually from Firebase Console, then click "Seed Sample Data" to avoid duplicates.'
      );
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="space-x-2">
        <button
          onClick={handleSeedData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Seeding...' : 'Seed Sample Data'}
        </button>

        <button
          onClick={handleClearAndReseed}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear & Reseed
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 p-2 rounded ${
            message.includes('Error')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
