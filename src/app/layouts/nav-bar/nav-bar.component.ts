import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private authService: AuthService) {}

  userEmail: string | null = ""; // Stores the user's email
  isLoggedIn$!: Observable<boolean>; // Observable to track the user's login status


  ngOnInit(): void {
    // Retrieve the user's email from local storage if available
    const user = localStorage.getItem('user');
    if (user !== null) {
      this.userEmail = JSON.parse(user).email;
    }

    // Initialize isLoggedIn$ observable by subscribing to the AuthService's isLoggedIn() method
    this.isLoggedIn$ = this.authService.isLoggedIn();

    // Subscribe to the userEmail$ observable to keep userEmail updated
    this.authService.userEmail$.subscribe((email) => {
      this.userEmail = email;
    });
  }

  // Function to handle user logout
  onLogout() {
    this.authService.logoutUser();
    this.userEmail = ""; // Clear the userEmail
  }
}
