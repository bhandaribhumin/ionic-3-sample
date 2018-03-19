import { Injectable } from "@angular/core";

import "rxjs/add/operator/map";
import { Platform } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

/*
  Generated class for the SqlLiteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const DATABASE_NAME: string = "rtidb.db";
@Injectable()
export class SqlLiteProvider {
  db: any;
  private isOpen: boolean = false;

  //Konstruktor početak
  constructor(
 
    public _platform: Platform,
    private sqlite: SQLite
  ) {
    console.log("Hello Database Provider");

    this._platform.ready().then(() => {
      console.log("test");
      if (!this.isOpen) {
        this.sqlite = new SQLite();
        this.sqlite
          .create({ name: DATABASE_NAME, location: "default" })
          .then((db: SQLiteObject) => {
            //Prva tablica
            db
              .executeSql(
              "CREATE TABLE IF NOT EXISTS `faq` ( `faq_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `page_title` TEXT NOT NULL, `page_heading` TEXT NOT NULL, `page_content` TEXT NOT NULL,`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
              {}
              )
              .then(() => console.log("Executed SQL - faq"))
              .catch(e => console.log(e));
            //Druga tablica
            db
              .executeSql(
              "CREATE TABLE IF NOT EXISTS `faq_question` ( `faq_qts_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `question` TEXT NOT NULL, `answer` TEXT NOT NULL, `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
              {}
              )
              .then(() => console.log("Executed SQL - faq_question"))
              .catch(e => console.log(e));
            db
              .executeSql(
              "CREATE TABLE IF NOT EXISTS `contactus` ( `contactus_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `page_title` TEXT NOT NULL, `page_heading` TEXT NOT NULL, `page_content` TEXT NOT NULL,`email_address` TEXT NOT NULL,`contact_no` TEXT NOT NULL,`extra_field` TEXT,`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
              {}
              )
              .then(() => console.log("Executed SQL - contactus"))
              .catch(e => console.log(e));
            db
              .executeSql(
              "CREATE TABLE IF NOT EXISTS `sync` ( `sync_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `contact_us` INTEGER DEFAULT 0, `faq` INTEGER DEFAULT 0,`meeting` INTEGER DEFAULT 0,`updated_timestamp` TEXT,`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
              {}
              )
              .then(() => console.log("Executed SQL - sync"))
              .catch(e => console.log(e));
            db
              .executeSql(
              "CREATE TABLE IF NOT EXISTS `my_meetings` ( `meeting_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,`server_id` TEXT NOT NULL, `Subject` TEXT , `IsCancelled` INTEGER DEFAULT 0 ,`IsOrganizer` INTEGER DEFAULT 0 ,`ResponseStatus` TEXT ,`DisplayInNotification` TEXT ,`StartDate` TEXT ,`StartTime` TEXT,`EndDate` TEXT ,`EndTime` TEXT ,`Location` TEXT ,`Notes` TEXT,`Attendees` TEXT,`RoomName` TEXT,`startFilterDate` datetime,`updated_timestamp` TEXT ,'LocationEmailAddress' TEXT,`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
              {}
              )
              .then(() => console.log("Executed SQL - my_meetings"))
              .catch(e => console.log(e));
            db
              .executeSql(
              "CREATE TABLE IF NOT EXISTS `notification` ( `meeting_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,`server_id` TEXT NOT NULL, `Subject` TEXT , `IsCancelled` INTEGER DEFAULT 0 ,`IsOrganizer` INTEGER DEFAULT 0 ,`ResponseStatus` TEXT ,`DisplayInNotification` TEXT ,`StartDate` TEXT ,`StartTime` TEXT,`EndDate` TEXT ,`EndTime` TEXT ,`Location` TEXT ,`Notes` TEXT,`Attendees` TEXT ,`RoomName` TEXT,`startFilterDate` datetime,`updated_timestamp` TEXT ,`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
              {}
              )
              .then(() => console.log("Executed SQL - my_meetings"))
              .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
      }
    });
  }
  //notification 
  // meeting_id,server_id,Subject,IsCancelled,IsOrganizer,ResponseStatus,DisplayInNotification,StartDate,StartTime,EndDate,EndTime,Location,Notes,Attendees,updated_timestamp,created
  public saveSyncTableToSqlite(DataArray) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db
          .executeSql(
          "INSERT INTO sync (contact_us, faq, meeting,updated_timestamp) VALUES (?,?,?,?)",
          [
            DataArray.ContactUs,
            DataArray.FAQ,
            DataArray.Meeting,
            DataArray.updated_timestamp
          ]
          )
          .then(
          data => {
            console.log("INSERTED sync: " + JSON.stringify(data));
          },
          error => {
            console.log("ERROR sync insert: " + JSON.stringify(error.err));
          }
          );
      })
      .catch(e => console.log(e));
  }

  public getSyncOfflineData() {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM sync", []).then(
            data => {
              let DataArray = [];
              if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                  DataArray.push({
                    ContactUs: data.rows.item(i).contact_us,
                    FAQ: data.rows.item(i).faq,
                    Meeting: data.rows.item(i).meeting,
                    updated_timestamp: data.rows.item(i).updated_timestamp
                  });
                }
              }
              resolve(DataArray);
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(e => console.log(e));
    });
  }

  public deleteTableSyncOfflineData() {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM sync", []).then(
          data => {
            console.log("DELETED: " + JSON.stringify(data));
          },
          error => {
            console.log("ERROR sync delete : " + JSON.stringify(error.err));
          }
        );
      })
      .catch(e => console.log(e));
  }

  public saveContactusToSqlite(DataArrayContactus) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db
          .executeSql(
          "INSERT INTO contactus (page_title, page_heading, page_content,email_address,contact_no) VALUES (?, ?, ?, ?, ?)",
          [
            DataArrayContactus.PageTitle,
            DataArrayContactus.PageHeading,
            DataArrayContactus.PageContent,
            DataArrayContactus.EmailAddress,
            DataArrayContactus.ContactNo
          ]
          )
          .then(
          data => {
            console.log("INSERTED: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR contactus save : " + JSON.stringify(error.err)
            );
          }
          );
      })
      .catch(e => console.log(e));
  }

  public getContactusOfflineData() {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM contactus", []).then(
            data => {
              let LocalArrayTwo = [];
              if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                  LocalArrayTwo.push({
                    PageTitle: data.rows.item(i).page_title,
                    PageHeading: data.rows.item(i).page_heading,
                    PageContent: data.rows.item(i).page_content,
                    EmailAddress: data.rows.item(i).email_address,
                    ContactNo: data.rows.item(i).contact_no
                  });
                }
              }
              resolve(LocalArrayTwo);
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(e => console.log(e));
    });
  }

  public deleteContactusOfflineData() {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM contactus", []).then(
          data => {
            console.log("DELETED: " + JSON.stringify(data));
          },
          error => {
            console.log("ERROR contactus: " + JSON.stringify(error.err));
          }
        );
      })
      .catch(e => console.log(e));
  }
  //faq
  public saveFaqToSqlite(DataArrayFaq) {
    //console.log('Page content insert',JSON.stringify(DataArrayFaq));
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db
          .executeSql(
          "INSERT INTO `faq` (page_title, page_heading, page_content) VALUES (?, ?, ?)",
          [
            DataArrayFaq.PageTitle,
            DataArrayFaq.PageHeading,
            DataArrayFaq.PageContent
          ]
          )
          .then(
          data => {
            console.log("INSERTED:saveFaqToSqlite " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR contactus save : " + JSON.stringify(error.err)
            );
          }
          );
      })
      .catch(e => console.log(e));
  }

  public getFaqOfflineData() {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM faq", []).then(
            data => {
              let LocalArrayTwo = [];
              if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                  LocalArrayTwo.push({
                    PageTitle: data.rows.item(i).page_title,
                    PageHeading: data.rows.item(i).page_heading,
                    PageContent: data.rows.item(i).page_content
                  });
                }
              }
              resolve(LocalArrayTwo);
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(e => console.log(e));
    });
  }

  public deleteFaqOfflineData() {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM faq", []).then(
          data => {
            console.log("DELETED: " + JSON.stringify(data));
          },
          error => {
            console.log("ERROR contactus: " + JSON.stringify(error.err));
          }
        );
      })
      .catch(e => console.log(e));
  }
  //faq
  public saveFaqQuestionToSqlite(DataArrayFaqQuestion) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        console.log(JSON.stringify(DataArrayFaqQuestion));
        db
          .executeSql(
          "INSERT OR REPLACE INTO `faq_question` (question, answer) VALUES (?, ?)",
          [DataArrayFaqQuestion.Question, DataArrayFaqQuestion.Answer]
          )
          .then(
          data => {
            console.log("INSERTED:faq_question " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR contactus save : " + JSON.stringify(error.err)
            );
          }
          );
      })
      .catch(e => console.log(e));
  }

  public getFaqQuestionOfflineData() {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM faq_question", []).then(
            data => {
              let LocalArrayTwo = [];
              if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                  LocalArrayTwo.push({
                    Question: data.rows.item(i).question,
                    Answer: data.rows.item(i).answer
                  });
                }
              }
              resolve(LocalArrayTwo);
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(e => console.log(e));
    });
  }

  public deleteFaqQuestionOfflineData() {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM `faq_question`", []).then(
          data => {
            console.log("DELETED: " + JSON.stringify(data));
          },
          error => {
            console.log("ERROR DELETED: " + JSON.stringify(error.err));
          }
        );
      })
      .catch(e => console.log(e));
  }

  public saveMyMeetingsTableToSqlite(DataArray) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        console.log("DATA ARRAY", JSON.stringify(DataArray));
        db
          .executeSql(
          "INSERT INTO my_meetings (server_id, Subject, IsCancelled,IsOrganizer,ResponseStatus,DisplayInNotification,StartDate,StartTime,EndDate,EndTime,Location,Notes,Attendees,RoomName,startFilterDate,updated_timestamp,LocationEmailAddress) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",

          [
            DataArray.server_id,
            DataArray.Subject,
            DataArray.IsCancelled,
            DataArray.IsOrganizer,
            DataArray.ResponseStatus,
            DataArray.DisplayInNotification,
            DataArray.StartDate,
            DataArray.StartTime,
            DataArray.EndDate,
            DataArray.EndTime,
            DataArray.Location,
            DataArray.Notes,
            DataArray.Attendees,
            DataArray.RoomName,
            DataArray.startFilterDate,
            DataArray.updated_timestamp,
            DataArray.LocationEmailAddress
          ]
          )
          .then(
          data => {
            console.log("INSERTED my_meetings: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR my_meetings insert: " + JSON.stringify(error)
            );
          }
          );
      })
      .catch(e => console.log(e));
  }

  public getMyMeetingsOfflineData() {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM my_meetings", []).then(
            data => {
              let DataArray = [];
              if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                  DataArray.push({
                    meeting_id: data.rows.item(i).meeting_id,
                    server_id: data.rows.item(i).server_id,
                    Subject: data.rows.item(i).Subject,
                    IsCancelled: data.rows.item(i).IsCancelled,
                    IsOrganizer: data.rows.item(i).IsOrganizer,
                    ResponseStatus: data.rows.item(i).ResponseStatus,
                    DisplayInNotification: data.rows.item(i).DisplayInNotification,
                    StartDate: data.rows.item(i).StartDate,
                    StartTime: data.rows.item(i).StartTime,
                    EndDate: data.rows.item(i).EndDate,
                    EndTime: data.rows.item(i).EndTime,
                    Location: data.rows.item(i).Location,
                    Notes: data.rows.item(i).Notes,
                    Attendees: data.rows.item(i).Attendees,
                    RoomName: data.rows.item(i).RoomName,
                    startFilterDate: data.rows.item(i).startFilterDate,
                    updated_timestamp: data.rows.item(i).updated_timestamp,
                    LocationEmailAddress:data.rows.item(i).LocationEmailAddress
                  });
                }
              }
              resolve(DataArray);
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(e => console.log(e));
    });
  }

  public deleteTableMyMeetingsOfflineData() {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM my_meetings", []).then(
          data => {
            console.log("DELETED: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR my_meetings delete : " + JSON.stringify(error.err)
            );
          }
        );
      })
      .catch(e => console.log(e));
  }
  public deleteTableMyMeetingsOfflineDataByID(ID) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM my_meetings WHERE server_id=?", [ID]).then(
          data => {
            console.log("DELETED by ID: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR my_meetings delete data by ID : " + JSON.stringify(error.err)
            );
          }
        );
      })
      .catch(e => console.log(e));
  }
  public updateMeetingsData(data) {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql('UPDATE my_meetings SET DisplayInNotification=? WHERE server_id=?', [data.DisplayInNotification, data.server_id])
            .then(res => {
              console.log('meeting updated', res);
              resolve(res);
            })
            .catch(e => {
              console.log('executeSql error', e);
              reject(e);

            });
        })
        .catch(e => console.log(e));
    });
  }


  //start notification 

  public saveNotificationTableToSqlite(DataArray) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        console.log("saveNotificationTableToSqlite DATA ARRAY", JSON.stringify(DataArray));
        db
          .executeSql(
          "INSERT INTO notification (server_id,Subject,IsCancelled,IsOrganizer,ResponseStatus,DisplayInNotification,StartDate,StartTime,EndDate,EndTime,Location,Notes,Attendees,RoomName,startFilterDate,updated_timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",

          [
            DataArray.server_id,
            DataArray.Subject,
            DataArray.IsCancelled,
            DataArray.IsOrganizer,
            DataArray.ResponseStatus,
            DataArray.DisplayInNotification,
            DataArray.StartDate,
            DataArray.StartTime,
            DataArray.EndDate,
            DataArray.EndTime,
            DataArray.Location,
            DataArray.Notes,
            DataArray.Attendees,
            DataArray.RoomName,
            DataArray.startFilterDate,
            DataArray.updated_timestamp
          ]
          )
          .then(
          data => {
            console.log("INSERTED notification: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR notification insert: " + JSON.stringify(error)
            );
          }
          );
      })
      .catch(e => console.log(e));
  }

  public getNotificationOfflineData() {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM notification", []).then(
            data => {
              let DataArray = [];
              if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                  DataArray.push({
                    meeting_id: data.rows.item(i).meeting_id,
                    server_id: data.rows.item(i).server_id,
                    Subject: data.rows.item(i).Subject,
                    IsCancelled: data.rows.item(i).IsCancelled,
                    IsOrganizer: data.rows.item(i).IsOrganizer,
                    ResponseStatus: data.rows.item(i).ResponseStatus,
                    DisplayInNotification: data.rows.item(i).DisplayInNotification,
                    StartDate: data.rows.item(i).StartDate,
                    StartTime: data.rows.item(i).StartTime,
                    EndDate: data.rows.item(i).EndDate,
                    EndTime: data.rows.item(i).EndTime,
                    Location: data.rows.item(i).Location,
                    Notes: data.rows.item(i).Notes,
                    Attendees: data.rows.item(i).Attendees,
                    RoomName: data.rows.item(i).RoomName,
                    startFilterDate: data.rows.item(i).startFilterDate,
                    updated_timestamp: data.rows.item(i).updated_timestamp
                  });
                }
              }
              resolve(DataArray);
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(e => console.log(e));
    });
  }

  public deleteTableNotificationOfflineData() {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM notification", []).then(
          data => {
            console.log("DELETED: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR notification delete : " + JSON.stringify(error.err)
            );
          }
        );
      })
      .catch(e => console.log(e));
  }
  public deleteNotificationOfflineDataByID(ID) {
    this.sqlite
      .create({
        name: "rtidb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM notification WHERE server_id=?", [ID]).then(
          data => {
            console.log("DELETED by ID: " + JSON.stringify(data));
          },
          error => {
            console.log(
              "ERROR notification delete data by ID : " + JSON.stringify(error.err)
            );
          }
        );
      })
      .catch(e => console.log(e));
  }
  public updateNotificationData(data) {
    return new Promise((resolve, reject) => {
      this.sqlite
        .create({
          name: "rtidb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql('UPDATE notification SET DisplayInNotification=? WHERE server_id=?', [data.DisplayInNotification, data.server_id])
            .then(res => {
              console.log('notification updated', res);
              resolve(res);
            })
            .catch(e => {
              console.log('executeSql notification error', e);
              reject(e);

            });
        })
        .catch(e => console.log(e));
    });
  }

  //end notification
}
