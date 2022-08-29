import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  groupID: string = ""

  channelArray = [];

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.groupID =  this.route.snapshot.params['id'];
    alert("this is the groupID: " +  this.groupID);

    this.getChannels(this.groupID);
  }


  getChannels(groupID: string){
    console.log("test")
    this.httpClient.post(BACKEND_URL + "/getChannels", {groupID}, httpOptions).subscribe((data: any) =>{
      alert(JSON.stringify(data));
      this.channelArray = data;
    })
  }

}
