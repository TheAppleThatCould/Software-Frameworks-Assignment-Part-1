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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem("userName") || "";
    this.birthDate = localStorage.getItem("birthDate") || "";
    this.email = localStorage.getItem("email") || "";
    this.age = localStorage.getItem("age") || "";
    this.valid = localStorage.getItem("valid") === 'true' || false;

    if(this.valid == false){
      this.router.navigateByUrl('/login');
    }
  }

}
