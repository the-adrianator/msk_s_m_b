import SeedDataButton from '@/components/SeedDataButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          MSK Suggestion Management Board
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Stage 1 Complete: Data Models & Services
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The foundation is now ready with TypeScript interfaces, Firestore services, and comprehensive unit tests.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">TypeScript interfaces for Employees and Suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Firestore services with CRUD operations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Sample data seeding functionality</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Comprehensive unit tests for core functions</span>
            </div>
          </div>
        </div>

        <SeedDataButton />
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Next Steps
          </h3>
          <p className="text-blue-700 dark:text-blue-200 text-sm">
            Ready to proceed to Stage 2: Mock Admin Auth & Theme System. This will include the login screen, 
            role-based permissions, and light/dark theme toggle functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
