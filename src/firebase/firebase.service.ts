import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable()
export class FirebaseService {
  private adminApp: admin.app.App;

  constructor() {
    // Initialize Firebase Admin SDK
    this.adminApp = admin.initializeApp({
      credential: admin.credential.cert(require('../firebase-adminsdk.json')),
      databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com',
    });
  }

  getAdminAuth() {
    return this.adminApp.auth();
  }
}
