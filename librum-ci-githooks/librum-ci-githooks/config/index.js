import developmentConfig from './development';
import productionConfig from './production';
import testConfig from './test';

let config = developmentConfig;
if (process.env.NODE_ENV === 'test')
    config = testConfig;
else if (process.env.NODE_ENV === 'production')
    config = productionConfig;

export default config;
