import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";


interface GroupData {
  id: number;
  name: string;
  userID: number[];
  adminID: number;
  assistantID: number[];
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  // display link to adminArea component 
  adminAccess = 4;

  valid: boolean = false;
  userID: string = '';

  // The array that will contain all the groups the user is apart of.
  groupArray = [{id: 0, name: ""}];

  groupData: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};
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
    console.log("test")
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      console.log("this is group data: ", data)
      this.groupArray = data;
    })
  }

  getGroupsByUserID(){
    let userID = this.userID
    this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', {userID}, httpOptions).subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  navigateToGroup(groupID: number){
    // This function will redirect the user to a channel while preventing them from accessing a group they are not a part of.
    let userID = this.userID
    let displayMessage: boolean = true;
    this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', {userID}, httpOptions).subscribe((data: any) =>{
      let groupArray: GroupData[] = data;

      if(this.adminAccess > 1){
        groupArray.map(el => {
          if(el.id == groupID){
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
    let groups = this.groupData;

    this.httpClient.post(BACKEND_URL + '/createGroup', groups, httpOptions).subscribe((data: any) =>{})
  }

  deleteGroup(groupID: number){
    this.httpClient.post(BACKEND_URL + '/deleteGroup', {groupID}, httpOptions).subscribe((data: any) =>{})
    
  }
}
