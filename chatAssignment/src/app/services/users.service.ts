import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const BACKEND_URL = "http://localhost:3000";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

@Injectable({
  providedIn: 'root'
})
// A service for user related code.
export class UsersService {
  userID: number = 0;

  constructor(private httpClient: HttpClient) {
    // Recieve the current user's id.
    this.userID = parseInt(localStorage.getItem("userID") || "");
  }

  // The updateUserAvatar is a function that will run the updateUserAvatar api to update the user's avatar.
  updateUserAvatar(imagePath: string){
    let userID = this.userID;
    this.httpClient.post(BACKEND_URL + '/updateUserAvatar', {imagePath, userID}, httpOptions).subscribe((data: any) =>{ })
  }
}
