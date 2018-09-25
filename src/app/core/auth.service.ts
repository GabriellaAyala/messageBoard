import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable,of } from 'rxjs';
import { Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';


interface Roles {
  admin? : boolean;
}

class User {
  uid: string; 
  email: string; 
  displayName: string;
  roles: Roles; 
  
  constructor(authData) {
    this.email = authData.email;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore) { 
    this.user = this.afAuth.authState.pipe(switchMap(
      (user) => {
        if(user) {
          console.log("USER LOGGED IN");
          return this.firestore.doc<User>('users/' + user.uid).valueChanges();
        } else {
          console.log("NO USER LOGGED IN");
          return of(null); 
        }
      }
    ))
    
  }

  updateUser(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc('users/' + user.uid);
    const data: User ={
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      roles : { 
        admin: false                       //create a way for dynamic roles, request access from admin?
      }
    }
    return userRef.set(data, {merge : false});
  }


  login(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
      (credential) => {
        this.updateUser(credential.user);
      }).then(
        () => {
          console.log("Sucessfully logged in");
        }
      ).catch(
      () => {
        console.log("Something happened. . .")
      }
    );
  }

  logout() {
    this.afAuth.auth.signOut().then(
      () => {
        console.log("Successfully logged out");
      }).catch(
      () => {
        console.log("Something happened. . . ")
      }
    );
  }
}
