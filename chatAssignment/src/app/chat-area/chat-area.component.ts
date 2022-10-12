import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageUploadService } from '../services/image-upload.service';
import { SocketService } from '../services/socket.service';
import { ChannelsService } from '../services/channels.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
// A component that handle the chat page of the channels.
export class ChatAreaComponent implements OnInit {
  userName: string = "";
  userID: number = 0;
  channelID: number = 0;

  messageContent: string = "";
  message = [{channelID: 0, userID: 0, userName: "", message: "", avatar: "", imageURL: ""}];
  ioConnection: any;

  // Image
  selectedFile = null;
  imagePath = "";
  avatarURL: string = "";

  constructor(private socketService: SocketService, private route: ActivatedRoute,
              private ImageUploadService: ImageUploadService, private channelsService: ChannelsService) {}

  ngOnInit(): void {
    // Initialize variable and get data from local storage
    this.userName = localStorage.getItem("userName") || "";
    this.userID = parseInt(localStorage.getItem("userID") || "");
    this.avatarURL = localStorage.getItem("imageURL") || '';

    this.channelID = parseInt(this.route.snapshot.params['id']);
    this.getChatHistory(this.channelID);
    this.initToConnection();
  }

  // Create the connection with the socket
  private initToConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.getMessage()
      .subscribe((message: any) => {
        this.message.push({channelID: this.channelID, userID: this.userID, userName: this.userName, message: message,
          avatar: this.avatarURL, imageURL: this.imagePath});
        this.getChatHistory(this.channelID);
        
      });
  }

  // A function which will send a meesage
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

  // Get all the chat history for this channel based on the channelID
  getChatHistory(channelID: number){
    this.channelsService.getChatHistory(channelID).subscribe((data: any) =>{
      this.message = data.reverse();
    })
  }

  // Add a new message to the chat history for this channels 
  writeChatHistory(newMessage: Object){
    this.channelsService.writeChatHistory(newMessage);
  }

  // A function which will asign the file to this.selectedFile
  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
  }

  // A function which will upload and recieve a image
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
