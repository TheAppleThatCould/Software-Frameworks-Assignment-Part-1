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
  role: string;
  userID: string;
}

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  userName = ""
  userData: UserData | undefined;

  searchUserDisplay = false;
  createUserDisplay = false;

  constructor(private userAPIService: UserAPIServiceService, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  searchUser(userName:string){
    this.httpClient.post(BACKEND_URL + '/getUserByUserName', {userName}, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      this.userData = data[0];
    })
  }

  checkEmptyobject(obj: any){
    if(Object.keys(obj).length != 0){
      return true
    } else {
      return false
    }
  }

  // updateUser(){
  //   this.httpClient.post(BACKEND_URL + '/updateUser', this.userData, httpOptions).subscribe((data: any) =>{})
  // }

  updateUserRole(role: string){
    if(this.userData != undefined){
      this.userData["role"] = role
      this.httpClient.post(BACKEND_URL + '/updateUser', this.userData, httpOptions).subscribe((data: any) =>{})
    }
  }

  deleteUser(){
  }

  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
  }

}
