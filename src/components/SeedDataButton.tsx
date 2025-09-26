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

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Firestore Data Seeding</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to seed Firestore with sample employees and
        suggestions. Make sure your Firebase configuration is set up in
        .env.local
      </p>

      <button
        onClick={handleSeedData}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Seeding...' : 'Seed Sample Data'}
      </button>

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
