import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import GameStateProvider from "../context/providers/GameStateProvider";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-loading-skeleton/dist/skeleton.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Otapix</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GameStateProvider>
        <Component {...pageProps} />
      </GameStateProvider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
