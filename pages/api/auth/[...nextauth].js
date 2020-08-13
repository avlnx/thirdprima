import NextAuth from "next-auth"
import Providers from "next-auth/providers"

const options = {
  // Configure one or more authentication providers
  providers: [
    // Providers.Email({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN
    })
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.MONGODB_URI,
}

export default (req, res) => NextAuth(req, res, options)