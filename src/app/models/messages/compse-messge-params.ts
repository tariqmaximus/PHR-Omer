export class ComposeMessageParams {
    messageId: number;
    messageDate: string = '';
    messageThreadId: number;
    //patientId: number;
    providerId: number;
    //patientName: string = '';
    providerName: string = '';
    subject: string = '';
    messageBodyHtml: string = '';
    messageBodyText: string = '';
    message_type: string = '';
    is_amendments: boolean = false;

    // request_details: string;
    // request_status: string;
    // practice_id: number;
    // deleted: boolean;
    // created_user: string;
    // client_date_created: string;
    // modified_user: string;
    // client_date_modified: string;
    // date_created: string;
    // date_modified: string;
    // system_ip: string;
    // request_date: string;
    // response_date: string;

    // msgFrom: [{ msg_from: '' }],
    // selectedProvider: [{ selected_provider: '' }],
    // selectedProviderName: [{ selected_provider_name: '' }],
    // msgType: [{ msg_type: '' }],
    // msgSubject: [{ msg_subject: '' }],
    // msgText: [{ msg_text: '' }],
    // msgId: [{ msg_id: '' }],
    // amendment: [{ msg_Amendment: '' }],
    // attachments: [{ msg_Attachments: '' }]
}