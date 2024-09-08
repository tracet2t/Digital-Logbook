import LoginPage from "@/components/LoginPage/LoginPage";
import Head from "next/head";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <LoginPage />
      </main>
    </>
  );
};

export default HomePage;
