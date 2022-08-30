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



  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.groupID =  this.route.snapshot.params['id'];
    this.getAllChannels(this.groupID);

    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;
  }


  getAllChannels(groupID: string){
    this.httpClient.post(BACKEND_URL + "/getChannels", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;
      console.log("test", this.channelArray)

    })
  }

  getChannels(groupID: string){
    this.httpClient.post(BACKEND_URL + "/getChannels", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;
      console.log("test", this.channelArray)

    })
  }

  createChannel(){
    this.channelData.groupID = this.groupID
    this.httpClient.post(BACKEND_URL + "/createChannel", this.channelData, httpOptions).subscribe((data: any) =>{})
  }

}
