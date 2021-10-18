import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Bitski from 'bitski-node';
import fetch from 'node-fetch';

// Configure bitski sdk
const CLIENT_ID = functions.config().bitski.client_id;
const BITSKI_PROVIDER_OPTIONS = {
  credentials: {
    id: functions.config().bitski.credential_id,
    secret: functions.config().bitski.credential_secret,
  },
  disableBlockTracking: true,
};

// Build bitski provider instance
const bitskiProvider = Bitski.getProvider(CLIENT_ID, BITSKI_PROVIDER_OPTIONS);

const assignEthereumWallet = functions.auth.user().onCreate(async (user) => {
  // Get server's access token
  let accessToken = await bitskiProvider.getAccessToken();

  // Create new account with ethereum address.
  let accountResult = await fetch('https://api.bitski.com/v1/accounts', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'X-API-Key': CLIENT_ID
    }
  });
  let account = await accountResult.json();

  // Associate the new ethereum address with the newly created user.
  await admin.auth().setCustomUserClaims(user.uid, { eth: account.ethereumAddress });

  // Update real-time database to notify client to force refresh.
  let metadataRef = admin.database().ref(`metadata/${user.uid}`);

  // Set the refresh time to the current UTC timestamp.
  // This will be captured on the client to force a token refresh.
  return metadataRef.set({refreshTime: new Date().getTime()});
});


export default {
  assignEthereumWallet
}
