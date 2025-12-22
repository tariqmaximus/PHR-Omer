import { Component, OnInit, Inject } from '@angular/core';
import { PhrService } from 'src/app/services/phr/phr.service';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { LogMessage } from 'src/app/shared/log-message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  inboxCount:String='0';
  archiveCount:String='0';
  message_type='';
  showMessage='';
  isNewMessage;
  lstMessagesCount;
  isLoading;

  constructor(private phrService:PhrService,
    @Inject(LOOKUP_LIST) public lookupList: LookupList,
    private logMessage: LogMessage) { }

  ngOnInit() {
    //this.onGetMessageCount();
    this.message_type="Inbox";
  }
  OnInbox(){
    this.message_type="Inbox";
  }
  OnArchive(){
    this.message_type="Archive";
  } 
  OnAmendments(){
    this.message_type="Amendment";
  }
onNewMessage(){
  this.isNewMessage=true;
}
  onCloseNewMessage(){
    debugger;
    this.isNewMessage=false;
    //this.onGetMessageCount();
    if(this.message_type.toLowerCase()=="inbox")
      this.OnInbox();
    else  if(this.message_type.toLowerCase()=="archive")
      this.OnArchive();
  }
  onGetMessageCount(){
    this.phrService.getMessagesCount(this.lookupList.logedInUser.userId.toString())
      .subscribe(
        data => {
          this.lstMessagesCount = data;
          for(let i=0;i<this.lstMessagesCount.length;i++)
          {
            if(this.lstMessagesCount[i].mail_status.toString().toLowerCase()=="inbox")
            {
              this.inboxCount=this.lstMessagesCount[i].cnt;
            }
            if(this.lstMessagesCount[i].mail_status.toString().toLowerCase() == "archive"){
              this.archiveCount = this.lstMessagesCount[i].cnt;
            }
          }
          this.isLoading = false;
        },
        error => {
          this.logMessage.log("An Error Occured while getting getMessagesCount list.")
          this.isLoading = false;
        }
      );
  }
}
