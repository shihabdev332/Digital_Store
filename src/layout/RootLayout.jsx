import React from "react";
import Header from "../component/Header";
import { Outlet } from "react-router-dom";
import Footer from "../component/Footer";
import Services from "../component/Services";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
          <Services />
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          }}
        />
      </div>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
