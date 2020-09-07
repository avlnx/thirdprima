import { Provider } from "next-auth/client"
// import "../styles.css"

export default function App ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
      <style jsx global>{`
      
      `}</style>
    </Provider>
  )
}