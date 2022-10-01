import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from "socket.io-client";
const SERVER_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
// A service for the socket code.
export class SocketService {
  private socket: any;

  constructor() { }

  // The socket intial setup.
  initSocket(){
    this.socket = io(SERVER_URL);
    return () => {this.socket.disconnect();}
  }

  //A function that will send the new message to all subscribers.
  send(message: string){
    this.socket.emit("message", message);
  }

  //A function that will return a observable for the new message.
  getMessage(){
    return new Observable(observer => {
      this.socket.on("message", (data: string) => {observer.next(data)});
    });
  }
}
