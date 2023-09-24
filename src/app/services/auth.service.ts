import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject to track the user's login status
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Flag to track login status within guards
  isLoggedInGuard: boolean = false;

  // Store the user's email
  userEmail: string = "";

  // BehaviorSubject to track the user's email
  private userEmailSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // Observable for the user's email
  public userEmail$: Observable<string | null> = this.userEmailSubject.asObservable();

  constructor(
    private fireauth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  // Function for user login
  login(email: string, password: string) {
    this.fireauth
      .signInWithEmailAndPassword(email, password)
      .then((logRef) => {
        // Display a success toast message on successful login
        this.toastr.success('Login Successfully..!');

        // Load user data and set login status
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;

        // Update user email in AuthService
        this.setUserEmail(email);

        // Navigate to the home page
        this.router.navigate(['/']);
        console.clear();
      })
      .catch(() => {
        // Display a warning toast message for login failure
        this.toastr.warning('Your email or password is incorrect.');
      });
  }

  // Function to load user data
  loadUser() {
    this.fireauth.authState.subscribe((user) => {
      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  // Function to logout the user
  logoutUser() {
    this.fireauth.signOut().then(() => {
      // Display a success toast message on successful logout
      this.toastr.success('Logout Successfully!');

      // Remove user data from local storage and update login status
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;

      // Update user email to null in AuthService
      this.setUserEmail(null);

      // Navigate to the login page
      this.router.navigate(['/login']);
    });
  }

  // Function to check if a user is logged in
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Function to set the user's email
  setUserEmail(email: string | null) {
    this.userEmailSubject.next(email);
  }
}
