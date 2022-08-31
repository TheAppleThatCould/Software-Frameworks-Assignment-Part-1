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
  adminAccess = 4;

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
    
    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;

  }

  getGroupDetails(){
    this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', this.user, httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  getAllGroups(){
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  createGroup(){
    console.log(this.groupData);
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      let groupArray = data;
      this.groupData.groupID = groupArray.groupID;
      this.httpClient.post(BACKEND_URL + '/createGroup', this.groupData, httpOptions).subscribe((data: any) =>{})
    })
  }

  deleteGroup(groupID: string){
    console.log(groupID);
    this.httpClient.post(BACKEND_URL + '/deleteGroup', {groupID}, httpOptions).subscribe((data: any) =>{})
    
  }
}
