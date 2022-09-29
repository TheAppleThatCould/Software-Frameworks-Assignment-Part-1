import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) {}

  imgUpload(fd: any){
    return this.http.post<any>('http://localhost:3000/imageUpload', fd)
  }
}
