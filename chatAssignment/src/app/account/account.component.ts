import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userName = "";
  birthDate = "";
  email = "";
  age = "";
  valid: boolean = false; 

  constructor(private router: Router) {
    this.userName = sessionStorage.getItem("userName") || "";
    this.birthDate = sessionStorage.getItem("birthDate") || "";
    this.email = sessionStorage.getItem("email") || "";
    this.age = sessionStorage.getItem("age") || "";
    this.valid = sessionStorage.getItem("valid") === 'true' || false;

    if(this.valid == false){
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
  }

}
