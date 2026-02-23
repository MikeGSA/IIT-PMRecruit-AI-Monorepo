import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { useRecruitStore } from '@/lib/store';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Rehydrate Zustand store from localStorage after client mount.
    // Prevents SSR/client HTML mismatch (skipHydration is set in store).
    useRecruitStore.persist.rehydrate();
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
