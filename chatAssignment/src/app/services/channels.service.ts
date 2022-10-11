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

  getChannelByChannelName(channelName: string){
    return this.httpClient.post(BACKEND_URL + "/getChannelByChannelName", {channelName}, httpOptions)
  }

  createChannel(newChannel: ChannelData){
    this.httpClient.post(BACKEND_URL + "/createChannel", newChannel, httpOptions).subscribe((data: any) =>{});
  }

  addUserToChannel(userID: number, channelID: number){
    this.httpClient.post(BACKEND_URL + "/addUserToChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
  }

  removeUserFromChannel(userID: number, channelID: number){
    this.httpClient.post(BACKEND_URL + "/removeUserFromChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
  }

  deleteChannel(channelID: number){
    this.httpClient.post(BACKEND_URL + "/deleteChannel", {channelID}, httpOptions).subscribe((data: any) =>{})
  }

  getChatHistory(channelID: number){
    return this.httpClient.post(BACKEND_URL + "/getChannelHistory", {channelID}, httpOptions)
  }

  writeChatHistory(newMessage: Object){
    this.httpClient.post(BACKEND_URL + "/writeChannelHistory", newMessage, httpOptions).subscribe((data: any) =>{})
  }
}
