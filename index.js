import { watchFile } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';
import { startBackupJob } from './backup.js';

async function readConfiguration() {
  try {
    const response = await fs.readFile(path.normalize('./config.json'));
    return JSON.parse(response.toString());
  } catch (error) {
    console.error(error);
    console.info("No configuration supplied");
    return false;
  }
}

async function startJob() {
  const configuration = await readConfiguration();
  if(configuration){
    const config = {
      interval: configuration.interval,
      outputDirectory: configuration.outputDirectory,
      historyTimeout: configuration.historyTimeout
    };
    startBackupJob(config, configuration.dbConfig);
  }
}

async function main() {
  startJob();
  const onChange = () => {
    console.log('config.json has been changed. Restarting...');
    // Start job again
    startJob();
  }
  const watchConfig = { persistent: true, interval: 1000 };
  watchFile(path.normalize('./config.json'), watchConfig, onChange);
}

main();
