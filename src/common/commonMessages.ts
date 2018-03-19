import { Injectable } from '@angular/core';
@Injectable()
export class commonMessages {
  public NOTIFICATION_TITLE: string = 'New Notification';
  public IGNORE_TEXT: string = 'Ignore';
  public CANCEL_TEXT: string = 'Cancel';
  public DE_REGISTER_TEXT: string =  'Deregistration failed upon logout attempt.';
  public TOAST_NETWORK_DISCONNECTED_TEXT: string =  'You are offline. Please check wifi or mobile network connectivity.';
  public TIMEOUT_TEXT: string = 'Timeout has occurred';
  public TOAST_SELECT_LOCATION_TEXT: string = 'Please select a location.';
  public TOAST_SELECT_MEETING_TEXT: string = 'Please enter Meeting Name.';
  public TOAST_SELECT_DATE_TEXT: string = 'Please select Date(s).';
  public TOAST_SELECT_START_TIME_TEXT: string = 'Please select Start Time.';
  public TOAST_SELECT_ENDTIME_TEXT: string = 'Please select End Time.';
  public TOAST_SELECT_NOTES_TEXT: string = 'Please enter Meeting Notes';
  public MEETING_BOOKING_PAST_TIME_TEXT: string='Sorry, you cannot book a meeting room for past time.';
  public MEETING_BOOKING_FIND_ROOM_ERROR_TEXT: string= 'Error while find room, Please try again.';
  public NO_INTERNET_CONNECTION_TEXT: string = 'No internet connection';
  public SOMTHING_WENT_WRONG_TEXT: string = 'Something went wrong. Please try again.';
  public SERVICE_API_ERROR_TEXT:string='Error on service API';
  public ATTENDEE_EXIST_TEXT:string = 'Attendee already added';
  public GOOGLE_MAP_FAILED_LOAD_MAP_TEXT:string = 'Failed to load Google Map. It seems your network is disconnected.';
  public INSTANT_MEETING_TIME_CONFLICT:string = 'End time should not be less than or equal to the start time';
  public LOGIN_ENTER_CREDENTIAL_TEXT:string = 'Please enter your credentials';
  public REACHED_BUILDING_TEXTUAL_TEXT:string = 'You have reached the building. please click ok to go to the textual Navigation page';
  public REACHED_BUILDING_HOME_TEXT:string = 'You have reached the building. please click ok to go to the Home page.';
  public ROOM_NOT_AVAILABLE_TEXT:string = 'This meeting room is notavailable anymore. Please try some other room.';
  public MEETING_ROOM_FEATURE_LOAD_ERROR:string='Failed to load meeting room features';
  public USER_OUTSIDE_RTICAMPUS_TEXT:string='It seems you are currently outside of RTI Campus. This feature works only when you are on RTI Main Campus in Durham, NC.';
  public LOCATION_PERMISSION_NOT_ENABLED_TEXT:string='Location Access Permisson is not enabled.Please enable from Phone setting and try again!';
  public CANCEL_ALL_NOTOFICATION_TEXT:string='Notifications cancelled';
  public NO_DIRECTION_RESULT_TEXT:string='Directions are unavailable at this time.';
  public BARCODE_PERMISSION_ERROR_TEXT:string='Barcode Access Permisson is not enabled.Please enable from Phone setting and try again.';
  public INVALID_QR_CODE_TEXT:string='Invalid QR code.';
  public QR_CODE_USER_CANCELLED_OPERATION:string='User has cancelled the operation';
  public ROOM_ATTENDEES_CAPACITY_EXCEED_ERROR :string = 'No more attendees can be added as it is exceeding the room’s capacity'
  public API_CALL_FAILED:string = 'Api call failed.Please try again!'
  public APP_TERMINATE_TITLE_TEXT:string= 'App termination';
  public APP_TERMINATE_MESSAGE_TEXT:string = 'Do you want to close the app?';
  public APP_CLOSE_BUTTON_TEXT:string='Close App';
  public APP_LOCATION_ACCESS_PERMISSON_TEXT:string ='Location Access Permisson is not enabled.Please enable from Phone setting and try again!'
  public APP_LOCATION_OUTSIDE_CAMPUS_TEXT:string = 'It seems you are currently outside of RTI Campus, please be inside the campus to use this feature.';
  public NO_MEETING_SEARCH_TEXT:string='No meetings found';
  public MEETING_EDIT_PAST_TIME_TEXT:String='Sorry, you cannot edit a meeting room for past time.';
  constructor() { }
}