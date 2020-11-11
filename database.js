const sqlite = require("sqlite3")

class Database {
     db;
     connectToDatabase = () => {
        this.db =  new sqlite.Database('./db/teamsBot.db', (err) => {
             if (err) {
               console.error(err.message);
             }
           });
     }
     
      closeDatabaseConnection = () => {
         this.db.close((err) => {
             if (err) {
               console.error(err.message);
             }
           });
     }

      createTable = () => {
        this.db.run('CREATE TABLE timetable(class text, start_time text, end_time text, day text)');
    }
    
     viewTimeTable = () => {
        this.connectToDatabase()
        let sql = `SELECT * from timetable`;
        this.db.all(sql, [], (err, rows) => {
            rows.forEach(row => {
                console.log(row);
            });
          
            });
         this.closeDatabaseConnection()
    }

    insertIntoTimeTable(){

    }
    
     
}

module.exports = Database