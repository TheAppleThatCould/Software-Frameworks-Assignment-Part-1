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
  messageContent: string = "";
  message = [{userID: "", message: ""}];
  ioConnection: any;

  channelID: string = "";
  chatHistory = [];

  constructor(private socketService: SocketService, private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.channelID =  this.route.snapshot.params['id'];
    // alert("this is the channelID: " +  this.channelID);

    this.getChatHistory(this.channelID);

    this.initToConnection();
  }

  private initToConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.getMessage()
      .subscribe((message: any) => {
        this.message.push(message);
      });
  }

  public chat(){
    if(this.messageContent){
      this.socketService.send(this.messageContent);
      this.messageContent = "";
    } else {
      console.log("no message")
    }
  }

  getChatHistory(channelID: string){
    console.log("test", channelID)
    this.httpClient.post(BACKEND_URL + "/getChannelHistory", {channelID}, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      this.chatHistory = data;
      this.message = data[0].history;
      alert(this.message);

    })
  }
}
