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

interface ChannelData {
  channelID: string;
  name: string;
  groupID: string;
  userID: string[];
}

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  adminAccess = 4;

  userName: string = ""
  userData: UserData = {userName: "", email: "", birthDate: "", age: 0, password: "", role: "", userID: "", valid: false};
  userArray: UserData[] = [];


  groupName: string = ""
  groupData: GroupData = {groupID: '', name: '', userID: [""], adminID: "", assistantID: [""]};
  groupArray: GroupData[] = [];

  channelData: ChannelData = {channelID: "", name: "", groupID: "", userID: [""]};
  channelArray: ChannelData[] = [];

  searchUserDisplay: boolean = false;
  createUserDisplay: boolean = false;
  searchGroupDisplay: boolean = false;
  displayAllUsersDisplay: boolean = false;
  displayAllGroupsDisplay: boolean = false;
  displayAllChannelDisplay: boolean = false;


  constructor(private userAPIService: UserAPIServiceService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllGroups();
    this.getAllChannel();

    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;
  }

  searchUser(userName: string){
    this.httpClient.post(BACKEND_URL + '/getUserByUserName', {userName}, httpOptions).subscribe((data: any) =>{
      this.userData = data[0];
    })
  }

  updateUserRole(role: string){
    this.userData["role"] = role
    this.httpClient.post(BACKEND_URL + '/updateUser', this.userData, httpOptions).subscribe((data: any) =>{})
  }

  deleteUser(userID: string){
    this.httpClient.post(BACKEND_URL + '/deleteUser', {userID}, httpOptions).subscribe((data: any) =>{})
  }

  createUser(){
    this.httpClient.post(BACKEND_URL + '/createUser', this.userData, httpOptions).subscribe((data: any) =>{})
  }

  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
    this.searchGroupDisplay = false;
    this.displayAllUsersDisplay = false;
    this.displayAllGroupsDisplay = false;
    this.displayAllChannelDisplay = false;
  }

  getAllUsers(){
    this.httpClient.get(BACKEND_URL + '/getAllUsers', httpOptions).subscribe((data: any) =>{
      this.userArray = data.userDetails;
    })
  }

  getAllGroups(){
    this.httpClient.get(BACKEND_URL + '/getGroups', httpOptions).subscribe((data: any) =>{
      console.log(data)
      this.groupArray = data;
    })
  }

  getAllChannel(){
    this.httpClient.get(BACKEND_URL + '/getChannel', httpOptions).subscribe((data: any) =>{
      this.channelArray = data.channels;
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
