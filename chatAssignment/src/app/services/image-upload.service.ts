import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// A service for image related code.
export class ImageUploadService {

  constructor(private http: HttpClient) {}

  //A function that will upload a image to the server and return the image name as a string.
  imgUpload(fd: any){
    console.log("fd inside of account: ", fd.getAll("image"));

    return this.http.post<any>('http://localhost:3000/imageUpload', fd)
  }
}
