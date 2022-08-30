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
  // display link to adminArea component 
  accessAdminArea = false;

  // Think about setting up a service to check if the user is login.
  // Because there going be alot of pages that need to check that.
  valid: boolean = false;
  user = {userID: ''};

  // The array that will contain all the groups the user is apart of.
  groupArray = [{groupID: "", name: ""}];

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.valid = localStorage.getItem("valid") === 'true' || false;
    this.user.userID = localStorage.getItem("userID") || "";

    if(this.valid == false){
      this.router.navigateByUrl('/login');
    } else {
      this.getGroupDetails()
    }

    this.accessAdminArea = localStorage.getItem("accessAdminArea") === "true" || false;
    console.log("access admin area: ", this.accessAdminArea)
  }

  getGroupDetails(){
    console.log("test test", this.user)
    this.httpClient.post(BACKEND_URL + '/getGroups', this.user, httpOptions).subscribe((data: any) =>{
      // alert(JSON.stringify(data));
      this.groupArray = data;
      console.log("test this.groupArray: ", this.groupArray)
    })
  }

}
