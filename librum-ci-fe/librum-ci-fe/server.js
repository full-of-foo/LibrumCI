const fs = require('fs');
const request = require('request-promise');
const connect = require('connect');
const serveStatic = require('serve-static');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const _requestExternalServiceUrls = () => {
    const internalMasterUrl = `http://${process.env.LIBRUM_CI_MASTER_SERVICE_HOST}/api/`;
    return request.get(internalMasterUrl, {json: true}).catch(err => console.error(err));
};
const _getLocalServiceUrl = service => {
    const localServicePort = service === 'MASTER' ? '8080' : '9001';
    return `http://localhost:${localServicePort}`;
};

const generateCompiledConfig = () => {
    const template = fs.readFileSync('templates/config.js', 'utf8');

    if (!IS_PRODUCTION) {
        return new Promise((resolve, reject) => {
            resolve(template.replace('{{GITHOOKS_URL}}', _getLocalServiceUrl('GITHOOKS'))
                        .replace('{{MASTER_URL}}', _getLocalServiceUrl('MASTER')));
        });
    }
    return _requestExternalServiceUrls().then(res => {
        return new Promise((resolve, reject) => {
            resolve(template.replace('{{GITHOOKS_URL}}', `http://${res.githooksHost.ip}`)
                        .replace('{{MASTER_URL}}', `http://${res.masterHost.ip}`));
        });
    });
};

generateCompiledConfig()
    .then(compiledConfig => {
        const serveCompiledConfig = (req, res, next) => {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(compiledConfig);
        };

        connect()
            .use(serveStatic(`${__dirname}/dist`))
            .use('/config.js', serveCompiledConfig)
            .listen(8081, () => console.log('Server running on 8081...'));
    })
    .catch(err => console.error(err));
