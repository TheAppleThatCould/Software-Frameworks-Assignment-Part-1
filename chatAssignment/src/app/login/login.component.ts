import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  displayErrorMessage: boolean = false;
  userDetail = {userName: "", password: ""};

  constructor() { }

  ngOnInit(): void {
  }

  public formSubmit() {
    
  }

}
