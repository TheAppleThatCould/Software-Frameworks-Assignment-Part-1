import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";


interface GroupData {
  groupID: string;
  name: string;
  userID: string[];
  adminID: string;
  assistantID: string[];
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  // display link to adminArea component 
  adminAccess = false;

  // Think about setting up a service to check if the user is login.
  // Because there going be alot of pages that need to check that.
  valid: boolean = false;
  user = {userID: ''};

  // The array that will contain all the groups the user is apart of.
  groupArray = [{groupID: "", name: ""}];

  groupData: GroupData = {groupID: '', name: '', userID: [""], adminID: "", assistantID: [""]};
  createUserDisplay: boolean = false;


  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.valid = localStorage.getItem("valid") === 'true' || false;
    this.user.userID = localStorage.getItem("userID") || "";

    if(this.valid == false){
      this.router.navigateByUrl('/login');
    } else {
      this.getGroupDetails()
    }
    
    this.adminAccess = localStorage.getItem("accessAdminArea") === "true" || false;
  }

  getGroupDetails(){
    console.log("test test", this.user)
    this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', this.user, httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
      console.log("getGroupDetails this.groupArray: ", this.groupArray)

    })
  }

  getAllGroups(){
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
      console.log("getAllGroups this.groupArray: ", this.groupArray)
    })
  }

  createGroup(){
    console.log(this.groupData);
    this.httpClient.post(BACKEND_URL + '/createGroup', this.groupData, httpOptions).subscribe((data: any) =>{})
  }
}
