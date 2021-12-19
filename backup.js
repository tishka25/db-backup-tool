import { CronJob } from 'cron';
import * as fs from 'fs/promises';
import path, { join } from 'path';
import { dumpDb } from './pg.js';

// Directory to store all backups
// Local for module job
var job = null;

/**
 * @param {String} address - Dddress of the remote SQL server.
 * @param {String} user - Username of the owner of the db
 * @param {String | undefined} password - Password of the SQL server
 * @param {String} db - The DB name
 * @param {String} outputDirectory - The directory in which to save the backups
 * @returns
 */
export const createBackup = async (address, user, password, db, outputDirectory) => {
  /**
   * TODO:
   * - remove old files
   */
  const fileName = `${address}-${db}-${Date.now()}-backup.sql`;
  const pathName = `${outputDirectory}/${fileName}`
  return await dumpDb(address, user, password, db, pathName);
}

export const deleteBackupOlderThat = async (seconds, backupDirectory) => {
  try {
    const files = await fs.readdir(backupDirectory);
    // Filter out older files
    for (var fileName of files) {
      // Tokens are as follows:
      // ${address}-${db}-${timestamp}-${backup.sql}
      const tokens = fileName.split('-');
      // Extract timestamp
      const currentFileTimestamp = parseInt(tokens[tokens.length - 2]);
      if (currentFileTimestamp < Date.now() - (seconds * 1000)) {
        // Delete file
        const currentPath = path.resolve(`${backupDirectory}/${fileName}`);
        await fs.unlink(currentPath)
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Start interval job for backing up the database. On every TICK of the job it automatically 
 * checks to delete old files. 
 * @param {Object} config
 * @param {String} config.interval - CronTab style of interval. See helper generator https://crontab.cronhub.io/
 * @param {Number} config.historyTimeout - How many seconds old files to remain. In SECONDS
 * @param {String} config.outputDirectory - The directory in which to save the backups
 * @param {Object} dbConfig
 * @param {String} dbConfig.address - Address of the remote SQL server.
 * @param {String} dbConfig.user - Username of the owner of the db
 * @param {String | undefined} dbConfig.password - Password of the SQL server
 * @param {String} dbConfig.db - The DB name
 */
export const startBackupJob = (config, dbConfig) => {
  const onTick = async () => {
    var result = await deleteBackupOlderThat(config.historyTimeout, config.outputDirectory);
    if (result) {
      result = await createBackup(dbConfig.address, dbConfig.user, dbConfig.password, dbConfig.db, config.outputDirectory);
    }

    // There was an error in either of the processes
    if (result === false) {
      console.error('There was an error in either of the processes. Exiting...');
      stopBackupJob();
    }
  };
  if(job){
    stopBackupJob();
  }
  job = new CronJob(config.interval, onTick, null, true);
}

export const stopBackupJob = () => {
  if (job) {
    job.stop();
    console.log('Restarted job service');
  } else {
    console.error('No jobs are available to stop');
  }
}