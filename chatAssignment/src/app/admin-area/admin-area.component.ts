import { Component, OnInit } from '@angular/core';
import { UserAPIServiceService } from '../services/user-apiservice.service';

import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  userName = ""
  userData = {};

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

  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
  }

}
