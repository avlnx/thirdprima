import { Provider } from "next-auth/client"

export default function App ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
      <style jsx global>{`
      html { margin: 0}
        body {
          margin: 0;
        }
      `}</style>
    </Provider>
  )
}