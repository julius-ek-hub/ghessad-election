import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="og:description" content="GHESSAD 2024 Executive Election" />
        <meta name="description" content="GHESSAD 2024 Executive Election" />
        <title>GHESSAD 2024 Executive Election</title>
        <meta
          name="og:title"
          content="GHESSAD 2024 Executive Election, Experience a new regime"
        />
        <meta
          name="image"
          content="https://ghessad-election.vercel.app/gessad-logo.jpeg"
        />
        <meta
          name="og:image"
          content="https://ghessad-election.vercel.app/gessad-logo.jpeg"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

<MyApp />;
