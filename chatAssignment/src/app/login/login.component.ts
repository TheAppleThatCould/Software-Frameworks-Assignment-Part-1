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
    console.log("This is the data: ", this.userDetail);

    this.httpClient.post(BACKEND_URL + '/login', this.userDetail, httpOptions).subscribe((data: any) =>{
      if(data){
        localStorage.setItem('userID', data.id.toString());
        localStorage.setItem('userName', data.userName.toString());
        localStorage.setItem('birthDate', data.birthDate.toString());
        localStorage.setItem('age', data.age.toString());
        localStorage.setItem('email', data.email.toString());
        localStorage.setItem('role', data.role.toString());
        localStorage.setItem('valid', data.valid.toString());
        localStorage.setItem('imageURL', data.imageURL.toString());
        
        console.log("THIS IS THE USERS: ", data.imageURL.toString())
        this.setUserAccessPermission(data.role.toString())

        this.router.navigateByUrl('/account');
      } else {
        this.displayErrorMessage = true;
      }
    })
  }


  setUserAccessPermission(userRole: string){
    if(userRole == "super" ){
      localStorage.setItem('adminAccess', "1");
    } else if(userRole == "groupAdmin"){
      localStorage.setItem('adminAccess', "2");
    } else if(userRole == "groupAssistant"){
      localStorage.setItem('adminAccess', "3");
    } else {
      localStorage.setItem('adminAccess', "4");
    }
  }

}