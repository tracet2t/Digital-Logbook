import './index.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
<<<<<<< HEAD
=======
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
>>>>>>> 707d1ba69e72b96f9d020c0d559acdc8e1840a16

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
<<<<<<< HEAD
       {children}
=======
        <AntdRegistry>{children}</AntdRegistry>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
>>>>>>> 707d1ba69e72b96f9d020c0d559acdc8e1840a16
      </body>
    </html>
  );
}