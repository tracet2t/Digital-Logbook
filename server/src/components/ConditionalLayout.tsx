// src/components/ConditionalLayout.tsx
import getSession from "@/server_actions/getSession";
import ProfileCard from "@/components/ProfileCard";


const ConditionalLayout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const session = await getSession(); // Fetch session directly on the server
  const authenticated = session.isAuthenticated();

  return (
    <>
      {authenticated && (
        <>
          {/* Logo in the top-left corner */}
          <div className="absolute top-4 left-4 mb-15" >
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
