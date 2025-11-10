import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../app/_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string = ''; // Declare empty strings for email and password
  password: string = '';

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onSubmit() {
    // Access form data using template reference variables
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    this.username = usernameInput.value;
    this.password = passwordInput.value;


    this.authenticationService.login(this.username, this.password)
    .pipe(first())
    .subscribe({
        next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([returnUrl]);
        }
    });
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

}
