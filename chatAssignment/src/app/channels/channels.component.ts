import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

interface ChannelData {
  channelID: string;
  name: string;
  groupID: string;
  userID: string[];
}


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  adminAccess = 4;

  groupID: string = "";
  channelArray = [{channelID: "", name: "", groupID: "", userID: [""]}];

  createChannelDisplay: boolean = false;
  channelData: ChannelData = {channelID: "", name: "", groupID: "", userID: [""]};

  userID = "";


  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.groupID =  this.route.snapshot.params['id'];
    this.userID = localStorage.getItem("userID") || "";

    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;


    if(this.adminAccess <= 0){
      this.getChannelsByGroupID(this.groupID);
    }else{
      this.getChannels(this.groupID, this.userID)
    }
  }


  getChannelsByGroupID(groupID: string){
    this.httpClient.post(BACKEND_URL + "/getChannelsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;

    })
  }

  getChannels(groupID: string, userID: string){
    this.httpClient.post(BACKEND_URL + "/getChannelsByUserID", {groupID, userID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;

    })
  }

  createChannel(){
    // A function that will create a channel with access permission to all users apart of the same group.
    let groupID = this.groupID;
    this.httpClient.post(BACKEND_URL + "/getGroupsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelData.groupID = this.groupID;
      this.channelData.userID = data.userID;
      this.httpClient.post(BACKEND_URL + "/createChannel", this.channelData, httpOptions).subscribe((data: any) =>{})
    })
  }


  addUserToChannel(userID: string, channelID: string){
    this.httpClient.post(BACKEND_URL + "/addUserToChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
  }

}
