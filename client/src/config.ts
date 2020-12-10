// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '8zsrds8xt1'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map
  domain: 'dev-b7rcqjet.us.auth0.com',            // Auth0 domain
  clientId: 'DIsa2p6Rf3tVYYP0UUVNB5oQu4Z3MiIB',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
