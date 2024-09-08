import PasswordResetPage from "@/components/passwordChange/PasswordResetPage";
import Head from "next/head";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Password change</title>
      </Head>
      <main>
        <PasswordResetPage />
      </main>
    </>
  );
};

export default HomePage;
