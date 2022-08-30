import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  displayErrorMessage: boolean = false;
  userDetail = {userName: "", password: ""};

  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  public formSubmit() {
    this.httpClient.post(BACKEND_URL + '/login', this.userDetail, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(this.userDetail));
      console.log("Data is: ", data)
      if(data.valid){
        localStorage.setItem('userID', data.userID.toString());
        localStorage.setItem('userName', data.userName.toString());
        localStorage.setItem('birthDate', data.birthDate.toString());
        localStorage.setItem('age', data.age.toString());
        localStorage.setItem('email', data.email.toString());
        localStorage.setItem('role', data.role.toString());
        localStorage.setItem('valid', data.valid.toString());

        if(data.role.toString() == "super" || data.role.toString() == "groupAdmin"){
          localStorage.setItem('accessAdminArea', "true");
        }else {
          localStorage.setItem('accessAdminArea', "false");
        }
        this.router.navigateByUrl('/account');
        
      } else {
        this.displayErrorMessage = true;
      }
    })
  }

}