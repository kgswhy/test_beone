"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import CustomerRegistration from "../components/customerRegistration";
import DashboardPage from "./dashboard/page";


const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah ada token di localStorage
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <>
      <Head>
        <title>PT ABC Integration UI</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      {/* Conditionally render based on login state */}
      {isLoggedIn ? <DashboardPage /> : <CustomerRegistration />}
    </>
  );
};

export default HomePage;
