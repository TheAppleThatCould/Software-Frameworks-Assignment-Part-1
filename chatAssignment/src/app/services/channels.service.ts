import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { httpOptions, BACKEND_URL } from './server.service';

// Reduce redundent code by having the channelData interface in one spot.
export interface ChannelData {
  id: number;
  name: string;
  groupID: number;
  userID: number[];
}

@Injectable({
  providedIn: 'root'
})
// A service for channel related code.
export class ChannelsService {

  constructor(private httpClient: HttpClient) { }

  // A function that get and return all channel
  getAllChannel(){
    return this.httpClient.get(BACKEND_URL + '/getChannel', httpOptions);
  }

  // A function that get and return all channels that contain the userID
  getChannelByUserID(userID: number, groupID: number){
    return this.httpClient.post(BACKEND_URL + "/getChannelsByUserID", {userID, groupID}, httpOptions);
  }

  // A function that get and return all channels that contain the groupID
  getChannelsByGroupID(groupID: number){
    return this.httpClient.post(BACKEND_URL + "/getChannelsByGroupID", {groupID}, httpOptions)
  }
  // A function which will get the channel based on the channel name
  getChannelByChannelName(channelName: string){
    return this.httpClient.post(BACKEND_URL + "/getChannelByChannelName", {channelName}, httpOptions)
  }
  // A function which will create a channel
  createChannel(newChannel: ChannelData){
    this.httpClient.post(BACKEND_URL + "/createChannel", newChannel, httpOptions).subscribe((data: any) =>{});
  }
  // A function which will add a user to a channel
  addUserToChannel(userID: number, channelID: number){
    this.httpClient.post(BACKEND_URL + "/addUserToChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
  }
  // A function which will remove a user from a channel
  removeUserFromChannel(userID: number, channelID: number){
    this.httpClient.post(BACKEND_URL + "/removeUserFromChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
  }
  // A function which will delete a channel
  deleteChannel(channelID: number){
    this.httpClient.post(BACKEND_URL + "/deleteChannel", {channelID}, httpOptions).subscribe((data: any) =>{})
  }
  // A function which will get the chat history
  getChatHistory(channelID: number){
    return this.httpClient.post(BACKEND_URL + "/getChannelHistory", {channelID}, httpOptions)
  }
// A function which will save the chat history
  writeChatHistory(newMessage: Object){
    this.httpClient.post(BACKEND_URL + "/writeChannelHistory", newMessage, httpOptions).subscribe((data: any) =>{})
  }
}
