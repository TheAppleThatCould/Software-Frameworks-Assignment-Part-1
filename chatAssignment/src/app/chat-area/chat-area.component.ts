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
  message = [{channelID: "", userID: "", userName: "", message: ""}];
  ioConnection: any;

  constructor(private socketService: SocketService, private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem("userName") || "";
    this.userID = localStorage.getItem("userID") || "";

    this.channelID = this.route.snapshot.params['id'];
    this.getChatHistory(this.channelID);
    this.initToConnection();
  }

  private initToConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.getMessage()
      .subscribe((message: any) => {
        this.message.push({channelID: this.channelID, userID: this.userID, userName: this.userName, message: message});
      });
  }

  public chat(){
    if(this.messageContent){
      this.socketService.send(this.messageContent);
      this.writeChatHistory({channelID: this.channelID, userID: this.userID, userName: this.userName, message: this.messageContent});
      this.messageContent = "";

    } else {
      console.log("no message")
    }
  }

  getChatHistory(channelID: string){
    console.log("test", channelID)
    this.httpClient.post(BACKEND_URL + "/getChannelHistory", {channelID}, httpOptions).subscribe((data: any) =>{
      // alert(JSON.stringify(data));
      this.message = data;
    })
  }

  writeChatHistory(newMessage: Object){
    console.log("Message detail on chatArea component: ", this.channelID, this.userName);

    this.httpClient.post(BACKEND_URL + "/writeChannelHistory", newMessage, httpOptions).subscribe((data: any) =>{})
  }
}
