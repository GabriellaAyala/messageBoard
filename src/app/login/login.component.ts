import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user;
  subscription;

  constructor(private authService : AuthService) {
                this.subscription = authService.user.subscribe(
                  (val) => {
                    this.user = val; 
                    console.log("v" , val);
                  }
                );
               }

  ngOnInit() {
  }

  onLogin(f: NgForm){
    const data = f.value;
    this.authService.login(data.email, data.password);
  }

  onLogout(){
    this.authService.logout();
  }

}
