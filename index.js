import { createBackup, deleteBackupOlderThat, startBackupJob } from './backup.js';

const config = { interval: "* * * * * *", historyTimeout: 1, outputDirectory: 'output-files' };
const dbConfig = { address: 'localhost', db: 'testdb', user: 'teodorstanishev' };
startBackupJob(config, dbConfig);