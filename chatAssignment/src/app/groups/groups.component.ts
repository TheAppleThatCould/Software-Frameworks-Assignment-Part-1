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
  userID: string = '';

  // The array that will contain all the groups the user is apart of.
  groupArray = [{groupID: "", name: ""}];

  groupData: GroupData = {groupID: '', name: '', userID: [""], adminID: "", assistantID: [""]};
  createUserDisplay: boolean = false;

  message: string = '';

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.valid = localStorage.getItem("valid") === 'true' || false;
    this.userID = localStorage.getItem("userID") || "";

    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;

    if(this.valid == false){
      this.router.navigateByUrl('/login');
    } else if(this.adminAccess == 1) {
      this.getAllGroups();
    } else {
      this.getGroupsByUserID();
    }
  }

  getAllGroups(){
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  getGroupsByUserID(){
    let userID = this.userID
    this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', {userID}, httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  navigateToGroup(groupID: string){
    let userID = this.userID
    let displayMessage: boolean = true;
    this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', {userID}, httpOptions).subscribe((data: any) =>{
      let groupArray: GroupData[] = data;
      console.log(groupArray);

      if(this.adminAccess > 1){
        groupArray.map(el => {
          if(el.groupID == groupID){
            this.router.navigateByUrl('/channels/' + groupID);
            displayMessage = false;
          }
        })
      } else {
        this.router.navigateByUrl('/channels/' + groupID);
        displayMessage = false;
      }

      if(displayMessage){
        this.message = "You Don't have access to this group"
      }
    })
    
  }

  createGroup(){
    console.log(this.groupData);
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      //Get all groups and  create a new groupID by adding 1 to the last group's ID
      let groupArray = data;
      let lastIndex = groupArray.length
      let newGroupID = parseInt(groupArray[lastIndex-1].groupID.substr(1)) + 1

      this.groupData.groupID = 'g00'+newGroupID;
      this.groupData.adminID = this.userID
      this.groupData.userID.push(this.userID)
      this.httpClient.post(BACKEND_URL + '/createGroup', this.groupData, httpOptions).subscribe((data: any) =>{})

    })
  }

  deleteGroup(groupID: string){
    console.log(groupID);
    this.httpClient.post(BACKEND_URL + '/deleteGroup', {groupID}, httpOptions).subscribe((data: any) =>{})
    
  }
}
