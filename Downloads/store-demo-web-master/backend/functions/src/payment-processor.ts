import * as functions from 'firebase-functions';
import BigNumber from 'bignumber.js';
import * as Bitski from 'bitski-node';
import Web3 from 'web3';
import Stripe from 'stripe';
import * as ERC1155ABI from './contracts/1155.json';

// Configure bitski sdk
const CLIENT_ID = functions.config().bitski.client_id;
const BITSKI_PROVIDER_OPTIONS = {
  credentials: {
    id: functions.config().bitski.credential_id,
    secret: functions.config().bitski.credential_secret,
  },
  disableBlockTracking: true,
};

// Build bitski provider and web3 instance
const bitskiProvider = Bitski.getProvider(CLIENT_ID, BITSKI_PROVIDER_OPTIONS);
const web3 = new Web3(bitskiProvider as any);
const contractConfig = functions.config().contract;

// Set up payment processor
const stripe = new Stripe(functions.config().stripe.api_key, { apiVersion: '2020-03-02' });

// Verify card charge and mint token
const processCreditCardTransaction = functions.https.onRequest(async (req, res) => {
  try {
    // Parse body and validate params
    let { stripeToken, tokenId, recipient } = req.body;
    if (!recipient) {
        return res.status(422).json({ error: { message: 'Recipient address not provided' } });
    }

    // Process credit card payment
    let tokenResponse = await processStripeTransaction(stripeToken, tokenId, recipient);

    // Return transaction response
    return res.json(tokenResponse);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});

// Response interface
interface TokenResponse {
    transactionHash: string
}

async function processStripeTransaction(stripeToken: string, tokenId: BigNumber, recipient: string): Promise<TokenResponse> {
  let tokenConfig = contractConfig.tokens.find((token: { id: BigNumber }) => token.id == tokenId);
  let priceUsd = tokenConfig.prices.find((price: { currency: string, price: string; }) => price.currency === 'USD').price;
  let chargeOptions = {
    source: stripeToken,
    currency: 'usd',
    description: tokenConfig.name,
    amount: new BigNumber(priceUsd).multipliedBy(100).toNumber(),
    capture: false
  };
  let charge = await stripe.charges.create(chargeOptions);
  let txn = await mintToken(tokenId, recipient, new BigNumber(1));
  await stripe.charges.update(charge.id, { metadata: { transactionHash: txn.transactionHash } });

  return txn;
}

async function mintToken(tokenId: BigNumber, recipient: string, amount: BigNumber): Promise<TokenResponse> {
    let accounts = await web3.eth.getAccounts();
    let contract = new web3.eth.Contract(ERC1155ABI as any, contractConfig.address)
    let transaction = contract.methods.mintFungible(tokenId, [recipient], [amount]);
    let hash = await transaction.send({ from: accounts[0] });

    return hash
}

export default {
  processCreditCardTransaction
}
