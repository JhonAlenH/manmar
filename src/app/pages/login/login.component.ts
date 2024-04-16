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
  xlogin: string = ''; // Declare empty strings for email and password
  xcontrasena: string = '';

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onSubmit() {
    // Access form data using template reference variables
    const emailInput = document.getElementById('xlogin') as HTMLInputElement;
    const passwordInput = document.getElementById('xcontrasena') as HTMLInputElement;

    this.xlogin = emailInput.value;
    this.xcontrasena = passwordInput.value;


    this.authenticationService.login(this.xlogin, this.xcontrasena)
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
