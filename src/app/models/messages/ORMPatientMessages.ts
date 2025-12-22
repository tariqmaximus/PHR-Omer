export class ORMPatientMessages {
    message_id: number;
    message_date: string;
    message_subject: string;
    message_body_html: string;
    message_body_text: string;
    sender_id: number;
    sender_source: string;
    provider_id: number;
    patient_id: number;
    is_draft: boolean = false;
    is_amendments: boolean = false;
    is_read: boolean = false;
    read_by: string;
    read_date: string;
    is_sender_archived: boolean = false;
    sender_archived_modified_user: string;
    sender_archived_modified_date: string;
    is_receiver_archived: boolean = false;
    receiver_archived_modified_user: string;
    receiver_archived_modified_date: string;
    message_thread_id: number;
    practice_id: number;
    system_ip: string;
    is_ehr_deleted: boolean = false;
    ehr_deleted_byr: string;
    ehr_deleted_date: string;

    is_phr_deleted: boolean = false;
    phr_deleted_by: string;
    phr_deleted_date: string;

    created_user: string;
    client_date_created: string;
    modified_user: string;
    client_date_modified: string;
    date_created: string;
    date_modified: string;

}