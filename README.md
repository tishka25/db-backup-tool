# PostgreSQL backup utility

Utility for backing up remote PostgreSQL database on configurable intervals with managable timeout in which the utility can auto delete old backups

## Configuration
Create in the root of the project a file named: ```config.json```

The contents of the configuration file are as follows
```json
{
  "outputDirectory": "/Some/Path/Of/A/Directory",
  "interval": "* * * * * *",
  "historyTimeout": 1,
  "dbConfig": { 
    "address": "localhost", 
    "db": "testdb", 
    "user": "username"
  }
}
```

```outputDirectory``` - The directory in which the utility is going to make the backup dumps <br>
```interval``` - CRON job like interval. See helpful tool for generating an CRON interval: https://crontab.cronhub.io/ <br>
```historyTimeout``` - How many seconds the utility is going to keep the backups. Ex: if a dump has been made 6 seconds ago and ```historyTimeout``` is set to 5 seconds, than the utility is going to delete this file. <br>
```dbConfig.address``` - Address of the PostgreSQL server <br>
```dbConfig.db``` - Name of the database <br>
```dbConfig.user``` - Username of the owner of the database <br>

## Installation
```
npm install
```

## Start
### Using normal cli
```
node index.js
```
### Using process manager (Recommended)
First you have to install the process manager. The recommended manager is ```pm2```. <br>
To install ```pm2``` run:
```
npm install -g pm2
```
After successful installation run:
```
pm2 start index.js --name db-backup-tool
```
To run the backup tool on start up, run: 
```
pm2 startup
pm2 save
```

### Tips
You can further change ```config.json``` without restarting the utility. The configration file is being watched for changes so it can always update its configuration


