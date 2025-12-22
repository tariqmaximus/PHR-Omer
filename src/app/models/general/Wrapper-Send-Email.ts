import { SendFaxAttachmentsFromClient } from "./send-fax-attachments-from-client";

export class WrapperSendEmail{
	practice_id:number;
	email_address:String;
	email_cc_address:String;
	subject:String;
	message_body:String;
	text_message:String;
	from_name:String;
    lstAttachments:Array<SendFaxAttachmentsFromClient>;
}

