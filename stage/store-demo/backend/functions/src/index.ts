import * as admin from 'firebase-admin';
import Wallet from './wallet';
import PaymentProcessor from './payment-processor';

// Initialize the Firebase admin sdk and db
admin.initializeApp();

export const assignEthereumWallet = Wallet.assignEthereumWallet;
export const processCreditCardTransaction = PaymentProcessor.processCreditCardTransaction;
