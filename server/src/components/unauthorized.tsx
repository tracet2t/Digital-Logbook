import React from 'react';
import { Button } from '@/components/ui/button'; 
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have the necessary permissions to access this page.
        </p>
        <Link href="/login">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
