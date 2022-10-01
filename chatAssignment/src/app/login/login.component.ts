import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
// A component for the login page.
export class LoginComponent implements OnInit {
  displayErrorMessage: boolean = false;
  userDetail = {userName: "", password: ""};

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit(): void {}

  // A function that will call the login api to log the user in and set the localstorage variable
  public formSubmit() {
    this.usersService.login(this.userDetail).subscribe((data: any) =>{
      // set the local storage if the the api returns data.
      if(data){
        localStorage.setItem('userID', data.id.toString());
        localStorage.setItem('userName', data.userName.toString());
        localStorage.setItem('birthDate', data.birthDate.toString());
        localStorage.setItem('age', data.age.toString());
        localStorage.setItem('email', data.email.toString());
        localStorage.setItem('role', data.role.toString());
        localStorage.setItem('valid', data.valid.toString());
        localStorage.setItem('imageURL', data.imageURL.toString());

        this.setUserAccessPermission(data.role.toString())
        this.router.navigateByUrl('/account');
      } else {
        // Display the error message if the user inputted the wrong password or username
        this.displayErrorMessage = true;
      }
    })
  }

  // A function that set the user accessLevel depending on their role.
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