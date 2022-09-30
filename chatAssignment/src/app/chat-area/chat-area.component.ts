import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

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

  avatarURL: string = "";

  constructor(private socketService: SocketService, private route: ActivatedRoute, private httpClient: HttpClient) {}

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
        this.message.push({channelID: this.channelID, userID: this.userID, userName: this.userName, message: message, avatar: this.avatarURL, imageURL: ""});
        this.getChatHistory(this.channelID);
        
      });
  }

  public chat(){
    if(this.messageContent){
      this.socketService.send(this.messageContent);
      this.writeChatHistory({channelID: this.channelID, userID: this.userID, userName: this.userName,
         message: this.messageContent, avatar: this.avatarURL, imageURL: ""});
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
    this.httpClient.post(BACKEND_URL + "/writeChannelHistory", newMessage, httpOptions).subscribe((data: any) =>{})
  }
}
