import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import WalletProvider from "./Context/WalletContextProvider";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Homepage from "./Pages/Homepage";
import DiscoveryPage from "./Pages/Discovery";
import { PageRoutes } from "./Constants/PageRoutes";

function App() {
  return (
    <Suspense fallback={<div />}>
      <WalletProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path={PageRoutes.HOMEPAGE} element={<Homepage />} />
            <Route path={PageRoutes.DISCOVERY} element={<DiscoveryPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        <Toaster position="top-right" />
      </WalletProvider>
    </Suspense>
  );
}

export default App;
