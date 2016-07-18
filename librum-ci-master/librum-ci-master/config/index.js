import developmentConfig from './development';
import testConfig from './test';

let config = developmentConfig;
if (process.env.NODE_ENV === 'test')
    config = testConfig;
else if (process.env.NODE_ENV === 'development')
    config = developmentConfig;

export default config;
