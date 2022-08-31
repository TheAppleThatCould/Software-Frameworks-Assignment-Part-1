import { Component, OnInit } from '@angular/core';
import { UserAPIServiceService } from '../services/user-apiservice.service';

import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";


interface UserData {
  userName: string;
  email: string;
  birthDate: string;
  age: number;
  password: string;
  role: string;
  userID: string;
  valid: boolean;
}

interface GroupData {
  groupID: string;
  name: string;
  userID: string[];
  adminID: string;
  assistantID: string[];
}

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  userName: string = ""
  userData: UserData = {userName: "", email: "", birthDate: "", age: 0, password: "", role: "", userID: "", valid: false};
  userArray: UserData[] = [];


  groupName: string = ""
  groupData: GroupData = {groupID: '', name: '', userID: [""], adminID: "", assistantID: [""]};

  searchUserDisplay: boolean = false;
  createUserDisplay: boolean = false;
  searchGroupDisplay: boolean = false;
  displayAllUsersDisplay: boolean = false;

  constructor(private userAPIService: UserAPIServiceService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  searchUser(userName: string){
    this.httpClient.post(BACKEND_URL + '/getUserByUserName', {userName}, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      this.userData = data[0];
    })
  }

  updateUserRole(role: string){
    this.userData["role"] = role
    this.httpClient.post(BACKEND_URL + '/updateUser', this.userData, httpOptions).subscribe((data: any) =>{})
  }

  deleteUser(){
    //TODO: CHECK IF I NEED TO ADD THIS FUNCTIONALITY
  }

  createUser(){
    this.httpClient.post(BACKEND_URL + '/createUser', this.userData, httpOptions).subscribe((data: any) =>{})
  }

  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
    this.searchGroupDisplay = false;
    this.displayAllUsersDisplay = false;
  }

  getAllUsers(){
    this.httpClient.get(BACKEND_URL + '/getAllUsers', httpOptions).subscribe((data: any) =>{
      this.userArray = data.userDetails;
      console.log("THIS IS ALL THE USERS: ", this.userArray)
    })

  }

  // searchGroup(groupName: string){
  //   this.httpClient.post(BACKEND_URL + '/getGroupsByGroupName', {groupName}, httpOptions).subscribe((data: any) =>{
  //     alert(JSON.stringify(data))
  //     this.groupData = data;
  //     console.log(this.groupData)
  //   })
  // }
}
