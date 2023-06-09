import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useEthPrice } from "~~/hooks/scaffold-eth";
import { useAppStore } from "~~/services/store/store";
import { wagmiClient } from "~~/services/web3/wagmiClient";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useEthPrice();
  const setEthPrice = useAppStore(state => state.setEthPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (price > 0) {
      setEthPrice(price);
    }
  }, [setEthPrice, price]);

  useEffect(() => {
    setIsDarkTheme(true);
  }, [isDarkMode]);

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", "scaffoldEthDark");
    // body.setAttribute("data-theme", "scaffoldEthDark");
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <NextNProgress />
        <RainbowKitProvider
          chains={appChains.chains}
          avatar={BlockieAvatar}
          theme={isDarkTheme ? darkTheme() : lightTheme()}
        >
          <div
            className="flex flex-col min-h-screen"
            style={{ position: "fixed", top: 0, left: 0, height: "100%", width: "100%" }}
          >
            <Header />
            <main className="relative flex flex-col flex-1 overflow-y-scroll">
              <Component {...pageProps} />
            </main>
            {/* <Footer /> */}
          </div>
          <Toaster />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default ScaffoldEthApp;
