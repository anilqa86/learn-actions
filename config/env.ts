import dotenv from 'dotenv';
import path from 'path';

const testEnv = process.env.TEST_ENV || 'qa';

const envFile = path.resolve(
  process.cwd(),
  `env/.env.${testEnv}`
);

console.log('=================================');
console.log(`TEST_ENV = ${testEnv}`);
console.log(`ENV FILE = ${envFile}`);
console.log('=================================');

const result = dotenv.config({
  path: envFile
});

if (result.error) {
  throw new Error(
    `Unable to load environment file: ${envFile}`
  );
}

if (!process.env.BASE_URL) {
  throw new Error(
    `BASE_URL is missing from ${envFile}`
  );
}

export const ENV = {
  name: testEnv,
  baseURL: process.env.BASE_URL,
  apiURL: process.env.API_URL || ''
};