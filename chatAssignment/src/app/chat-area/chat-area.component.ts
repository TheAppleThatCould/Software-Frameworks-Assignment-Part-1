import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { httpOptions, BACKEND_URL } from '../services/server.service';
import { ImageUploadService } from '../services/image-upload.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit {
  userName = "";
  userID = "";
  channelID: string = "";

  messageContent: string = "";
  message = [{channelID: "", userID: "", userName: "", message: "", avatar: "", imageURL: ""}];
  ioConnection: any;

  // Image
  selectedFile = null;
  imagePath = "";
  avatarURL: string = "";

  constructor(private socketService: SocketService, private route: ActivatedRoute, private httpClient: HttpClient,
              private ImageUploadService: ImageUploadService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem("userName") || "";
    this.userID = localStorage.getItem("userID") || "";
    this.avatarURL = localStorage.getItem("imageURL") || '';

    this.channelID = this.route.snapshot.params['id'];
    this.getChatHistory(this.channelID);
    this.initToConnection();
  }

  private initToConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.getMessage()
      .subscribe((message: any) => {
        this.message.push({channelID: this.channelID, userID: this.userID, userName: this.userName, message: message,
          avatar: this.avatarURL, imageURL: this.imagePath});
        this.getChatHistory(this.channelID);
        
      });
  }

  public chat(){
    if(this.messageContent){
      this.socketService.send(this.messageContent);
      this.writeChatHistory({channelID: this.channelID, userID: this.userID, userName: this.userName,
         message: this.messageContent, avatar: this.avatarURL, imageURL: this.imagePath});
      this.messageContent = "";

    } else {
      console.log("no message")
    }
  }

  getChatHistory(channelID: string){
    console.log("test", channelID)
    this.httpClient.post(BACKEND_URL + "/getChannelHistory", {channelID}, httpOptions).subscribe((data: any) =>{
      this.message = data.reverse();
    })
  }

  writeChatHistory(newMessage: Object){
    console.log(newMessage)
    this.httpClient.post(BACKEND_URL + "/writeChannelHistory", newMessage, httpOptions).subscribe((data: any) =>{})
  }


  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
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
        console.log( this.imagePath)
      })
    }
  }
}
