// import { Provider } from "next-auth/client"
// // import "../styles.css"

// export default function App ({ Component, pageProps }) {
//   return (
//     <Provider session={pageProps.session}>
//       <Component {...pageProps} />
      // <style jsx global>{`
      // html, body { margin: 0 }
      // `}</style>
//     </Provider>
//   )
// }

//_app.js

// import App from 'next/app'
import React from 'react'
import Router from 'next/router';
import * as PropTypes from 'prop-types'
import { Provider } from "next-auth/client"

// we are doing this to fix a bug in next.js
// see https://github.com/vercel/next-plugins/issues/263
class MyApp extends React.Component {
  cacheURL = []
  handleLoadStyle = (url) => {
    if (this.cacheURL.includes(url)) return
    const els = document.querySelectorAll(
      'link[href*="/_next/static/css/styles.chunk.css"]')
    const timestamp = new Date().valueOf()
    for (let i = 0; i < els.length; i++) {
      if (els[i].rel === 'stylesheet') {
        els[i].href = '/_next/static/css/styles.chunk.css?v=' + timestamp
        console.log('Style loaded')
        this.cacheURL.push(url)
        break
      }
    }
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      // prevent duplication listener
      Router.events.on('routeChangeComplete', this.handleLoadStyle)
    }
  }

  componentWillUnmount() {
    if (process.env.NODE_ENV !== 'production') {
      Router.events.off('routeChangeComplete', this.handleLoadStyle)
    }
  }

  render() {
    let { Component, pageProps } = this.props


    return (
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
        <style jsx global>{`
          html, body { margin: 0 }
        `}</style>
      </Provider>
    )
  }
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
}


export default MyApp