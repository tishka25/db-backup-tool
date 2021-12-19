import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
const execAsync = promisify(exec);



// Prototype of pg dump
// pg_dump -h [host address] -Fc -o -U [database user] <database name> > [dump file]
const getAddress =  (address, user, password, db) => {
  // postgresql://user:secret@localhost
  const _password = password ? `:${password}` : '';
  return `postgresql://${user}${_password}@${address}/${db}`
}
/**
 * 
 * @param {String} address - Dddress of the remote SQL server.
 * @param {String} user - Username of the owner of the db
 * @param {String} db - The DB name
 * @param {String} file - Output file of the created dump
 * @returns {Promise<Boolean>}
 */
export const dumpDb = async (address, user, password, db, file) => {
  const pathName = path.resolve(file)
  const { stdout, stderr } = await execAsync(`pg_dump ${getAddress(address, user, password, db)} > ${pathName}`);
  if(stderr) {
    console.error('Could not create db copy...', stderr);
    return false;
  }
  return true;
}