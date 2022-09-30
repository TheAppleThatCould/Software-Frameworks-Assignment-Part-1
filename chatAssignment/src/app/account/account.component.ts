import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageUploadService } from '../services/image-upload.service';
import { UsersService } from '../services/users.service';



import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};
const BACKEND_URL = "http://localhost:3000";



@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  //User's detail
  userName = "";
  birthDate = "";
  email = "";
  age = "";
  role = "";
  valid: boolean = false; 

  // Image
  selectedFile = null;
  imagePath = "photoOfMySelf.jpg";

  constructor(private router: Router, private ImageUploadService: ImageUploadService, private UsersService: UsersService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem("userName") || "";
    this.birthDate = localStorage.getItem("birthDate") || "";
    this.email = localStorage.getItem("email") || "";
    this.age = localStorage.getItem("age") || "";
    this.role = localStorage.getItem("role") || "";
    this.valid = localStorage.getItem("valid") === 'true' || false;
    this.imagePath = localStorage.getItem("imageURL") || '';

    if(this.valid == false){
      this.router.navigateByUrl('/login');
    }
  }


  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

  }

  uploadImage(){
    const fd = new FormData();
    if(this.selectedFile != null){
      // TODO:  "this.selectedFile.name" not working with typescript
      // @ts-ignore
      let fileName = this.selectedFile.name || "";
      fd.append('image', this.selectedFile, fileName)

      this.ImageUploadService.imgUpload(fd).subscribe(res => {
        this.imagePath = res.data.filename;
        this.UsersService.updateUserAvatar(this.imagePath);
        localStorage.setItem('imageURL', this.imagePath);
      })
    }
  }
}
