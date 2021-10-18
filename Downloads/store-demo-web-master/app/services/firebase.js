import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebaseui from 'firebaseui';

firebase.initializeApp({
  apiKey: 'AIzaSyCZtfYgK-BZ0Bat4tIqNtw4wla24QUimOA',
  authDomain: 'store-demo-54f5a.firebaseapp.com',
  databaseURL: 'https://store-demo-54f5a.firebaseio.com',
  projectId: 'store-demo-54f5a',
  storageBucket: 'store-demo-54f5a.appspot.com',
  messagingSenderId: '467573418157',
  appId: '1:467573418157:web:500a9e8c4887e915a07e24'
});
const ui = new firebaseui.auth.AuthUI(firebase.auth());

export default class FirebaseService extends Service {
  @tracked isLoggingIn;
  @tracked isProcessingWallet;
  @tracked user;

  initialize() {
    let callback = null;
    let metadataRef = null;
    let initialized = new Promise((resolve) => {
      this.onInit = resolve;
    });

    // Subscribe to auth changes
    firebase.auth().onAuthStateChanged(user => {

      // Remove previous token claim listener.
      if (callback) {
        metadataRef.off('value', callback);
      }

      if (user) {
        // User will have no accounts when originally signing up
        this.user = Object.assign({ accounts: [] }, user);

        // Check id token for account claims
        this.addUserEthAccountFromClaims().then(() => {

          // Auth status is now initialized if this is the first run
          if (this.onInit) {
            this.onInit(this.isLoggedIn);
            this.onInit = null;
          }
        });

        // Check if id token refresh is required (eth account added)
        metadataRef = firebase.database().ref(`metadata/${user.uid}/refreshTime`);
        callback = () => {
          // Force refresh to pick up the latest custom claims changes.
          if (!this.user || !this.user.accounts.length) {
            user.getIdToken(true).then(() => this.addUserEthAccountFromClaims());
          }
        };

        // Subscribe new listener to changes on that node so we know when the eth account is ready.
        metadataRef.on('value', callback);
      } else {
        // Else user is logging out
        this.user = null;

        // If first run, initialize to logged out
        if (this.onInit) {
          this.onInit(this.isLoggedIn);
          this.onInit = null;
        }
      }
    });

    return initialized;
  }

  get isLoggedIn() {
    return !!this.user;
  }

  async addUserEthAccountFromClaims() {
    firebase.auth().currentUser.getIdTokenResult().then(idTokenResult => {
      let ethAddress = idTokenResult.claims.eth;
      let user = this.user;

      if (user && ethAddress) {
        user.accounts = [ethAddress];
        this.user = user;
        this.isLoggingIn = false;

        if (this.resolveSignInPromise) {
          this.resolveSignInPromise(this.user);
          this.resolveSignInPromise = null;
          this.rejectSignInPromise = null;
        }
      }
    });
  }

  addLoginUi() {
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: () => {
          this.isProcessingWallet = true;
        },
        signInFailure: this.cancelLogIn.bind(this),
      },
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
        }
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    });
  }

  logIn() {
    // Show login ui
    this.isProcessingWallet = false;
    this.isLoggingIn = true;

    // Wait for user with account
    return new Promise((resolve, reject) => {
      this.resolveSignInPromise = resolve;
      this.rejectSignInPromise = reject;
    });
  }

  cancelLogIn(err) {
    this.isLoggingIn = false;

    // Call with error
    if (this.rejectSignInPromise) {
      this.rejectSignInPromise(err || new Error('Sign in request was cancelled.'));
    }

    // Remove listeners
    this.rejectSignInPromise = null;
    this.resolveSignInPromise = null;
  }

  logOut() {
    return firebase.auth().signOut();
  }

  getSignedInUser() {
    if (this.isLoggedIn) {
      return Promise.resolve(this.user);
    } else {
      return this.logIn();
    }
  }
}
