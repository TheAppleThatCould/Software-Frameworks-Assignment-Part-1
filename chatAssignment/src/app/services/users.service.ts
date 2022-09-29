import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const BACKEND_URL = "http://localhost:3000";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userID: number = 0;

  constructor(private httpClient: HttpClient) {
    this.userID = parseInt(localStorage.getItem("userID") || "");
  }

  updateUserAvatar(imagePath: string){
    let userID = this.userID;
    console.log("TEST", userID, imagePath)
    this.httpClient.post(BACKEND_URL + '/updateUserAvatar', {imagePath, userID}, httpOptions).subscribe((data: any) =>{ })
  }
}
