import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, BACKEND_URL } from './server.service';

export interface UserData {
  userName: string;
  email: string;
  birthDate: string;
  age: number;
  password: string;
  role: string;
  id: number;
  valid: boolean;
}

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

  getUserByUserName(userName: string){
    return this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions);
  }

  updateUser(userData: UserData){
    this.httpClient.post(BACKEND_URL + '/updateUser', userData, httpOptions).subscribe((data: any) =>{})
  }

  login(userDetail: {userName: string, password: string}){
    return this.httpClient.post(BACKEND_URL + '/login', userDetail, httpOptions);
  }
}
