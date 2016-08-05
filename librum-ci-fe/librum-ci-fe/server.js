const fs = require('fs');
const connect = require('connect');
const serveStatic = require('serve-static');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const _getServiceUrl = serviceShortName => {
    const service = serviceShortName.toUpperCase();
    const localServiceHost = process.env[`LIBRUM_CI_${service}_1_PORT_9001_TCP_ADDR`];
    const localServicePort = process.env[`LIBRUM_CI_${service}_1_PORT_9001_TCP_PORT`];
    const k8sServiceHost = process.env[`LIBRUM_CI_${service}_SERVICE_HOST`];

    if (IS_PRODUCTION) return `http://${k8sServiceHost}`;
    return `http://${localServiceHost}:${localServicePort}`;
};

const compiledConfig = fs.readFileSync('templates/config.js', 'utf8')
                            .replace('{{GITHOOKS_URL}}', _getServiceUrl('githooks'))
                            .replace('{{MASTER_URL}}', _getServiceUrl('master'));

const serveCompiledConfig = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(compiledConfig);
};

connect()
    .use(serveStatic(`${__dirname}/dist`))
    .use('/config.js', serveCompiledConfig)
    .listen(8081, () => console.log('Server running on 8081...'));
