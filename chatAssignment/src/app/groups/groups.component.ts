import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  // Think about setting up a service to check if the user is login.
  // Because there going be alot of pages that need to check that.
  valid: boolean = false;
  user = {userID: ''};

  // The array that will contain all the groups the user is apart of.
  groupArray = [{name: ""}];

  constructor(private router: Router, private httpClient: HttpClient) {
    this.valid = sessionStorage.getItem("valid") === 'true' || false;
    this.user.userID = sessionStorage.getItem("userID") || "";


    if(this.valid == false){
      this.router.navigateByUrl('/login');
    } else {
      this.getGroupDetails()
    }
   }

  ngOnInit(): void {

  }

  getGroupDetails(){
    console.log("test test", this.user)
    this.httpClient.post(BACKEND_URL + '/getGroups', this.user, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      this.groupArray = data;
      console.log("test this.groupArray: ", this.groupArray)
    })
  }

}
