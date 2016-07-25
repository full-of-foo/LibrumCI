import GithubHookHandler from 'github-webhook-handler';
import {onPush} from './push';

const webhookHandler = GithubHookHandler({ path: '/', secret: 'lol' });

webhookHandler.on('error', err => console.error('Error:', err.message));
webhookHandler.on('push', onPush);

export default webhookHandler;
