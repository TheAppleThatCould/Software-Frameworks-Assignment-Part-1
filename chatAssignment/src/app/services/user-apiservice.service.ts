import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class UserAPIServiceService {
  constructor(private httpClient: HttpClient) { }


  getUserByUserName(userName: string){
    return this.httpClient.post(BACKEND_URL + '/getUserByUserName', {userName}, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      return data[0];
    })

  }
}
