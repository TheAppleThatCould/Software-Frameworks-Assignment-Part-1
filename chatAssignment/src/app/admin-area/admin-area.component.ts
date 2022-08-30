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

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  userName = ""
  userData: UserData = {userName: "", email: "", birthDate: "", age: 0, password: "", role: "", userID: "", valid: false};

  searchUserDisplay = false;
  createUserDisplay = false;
  searchGroupDisplay = false;



  constructor(private userAPIService: UserAPIServiceService, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  searchUser(userName: string){
    this.httpClient.post(BACKEND_URL + '/getUserByUserName', {userName}, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      this.userData = data[0];
    })
  }

  // updateUser(){
  //   this.httpClient.post(BACKEND_URL + '/updateUser', this.userData, httpOptions).subscribe((data: any) =>{})
  // }

  updateUserRole(role: string){
    this.userData["role"] = role
    this.httpClient.post(BACKEND_URL + '/updateUser', this.userData, httpOptions).subscribe((data: any) =>{})
  }

  deleteUser(){
    
  }

  createUser(){
    this.httpClient.post(BACKEND_URL + '/createUser', this.userData, httpOptions).subscribe((data: any) =>{})
  }

  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
    this.searchGroupDisplay = false;

  }

}
