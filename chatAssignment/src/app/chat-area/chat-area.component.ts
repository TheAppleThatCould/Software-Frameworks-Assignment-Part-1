import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit {
  messageContent: string = "";
  message: string[] = [];
  ioConnection:any;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initToConnection()
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
}
