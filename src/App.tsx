import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@badrap/bar-of-progress";

import WalletProvider from "./Context/WalletContextProvider";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Homepage from "./Pages/Homepage";
import DiscoveryPage from "./Pages/Discovery";
import { PageRoutes } from "./Constants/PageRoutes";
import FullPageLoader from "./Util/FullPageLoader";

// Progress Bar on while changing the route
const progressBar = new ProgressBar({
  // The size (height) of the progress bar.
  // Numeric values get converted to px.
  size: 2,

  // Color of the progress bar.
  // Also used for the glow around the bar.
  color: "#000",

  // Class name used for the progress bar element.
  className: "bar-of-progress",

  // How many milliseconds to wait before the progress bar
  // animation starts after calling .start().
  delay: 100,
});

function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <WalletProvider>
        <BrowserRouter>
          <Navbar />
          <PublicRoute>
            <Route path={PageRoutes.HOMEPAGE} element={<Homepage />} />
            <Route path={PageRoutes.DISCOVERY} element={<DiscoveryPage />} />
          </PublicRoute>
          <Footer />
        </BrowserRouter>
        <Toaster position="top-right" />
      </WalletProvider>
    </Suspense>
  );
}

const PublicRoute = ({ children }: any) => {
  const location = useLocation();

  useEffect(() => {
    // Run on every location change
    progressBar.start();
  }, [location.pathname]);

  setTimeout(() => {
    // Run on every location change
    progressBar.finish();
  }, 1000);
  return <Routes>{children}</Routes>;
};

export default App;
