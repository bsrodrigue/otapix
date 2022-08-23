import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (<RecoilRoot>
    <Component {...pageProps} />
    <ToastContainer />
  </RecoilRoot>)
}

export default MyApp
