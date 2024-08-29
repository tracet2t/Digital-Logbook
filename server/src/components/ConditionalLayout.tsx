'use client';

import { usePathname } from 'next/navigation'; // Import usePathname
import ProfileCard from "@/components/ProfileCard";

const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Get the current pathname

  const isLoginPage = pathname === '/login'; // Check if the current page is the login page

  return (
    <>
      {!isLoginPage && (
        <>
          {/* Logo in the top-left corner */}
          <div className="absolute top-4 left-4">
            <img
              src="../t2t logo.png" // Ensure correct file path and name
              alt="T2T Logo"
              className="w-24 h-auto" // Adjust size as needed
            />
          </div>

          {/* ProfileCard component in the top-right corner */}
          <div className="absolute top-4 right-4">
            <ProfileCard />
          </div>
        </>
      )}
      <main className="p-4">
        {children}
      </main>
    </>
  );
};

export default ConditionalLayout;
