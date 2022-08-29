import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { AccountComponent } from './account/account.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { GroupsComponent } from './groups/groups.component';
import { ChannelsComponent } from './channels/channels.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "account", component: AccountComponent},
  {path: "chatArea", component: ChatAreaComponent},
  {path: "groups", component: GroupsComponent},
  {path: "channels/:id", component: ChannelsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
