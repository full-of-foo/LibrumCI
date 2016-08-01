import Client from 'node-kubernetes-client';
import kubeClient from '../../../app/server/lib/kubeClient';

describe('Lib: kubeClient', () => {
    it('should be correctly instatiated', () => {
        expect(kubeClient).toBeDefined();
        expect(kubeClient.constructor).toBe(Client);
        expect(kubeClient.streamPod).toBeDefined();
    });

    it('can call streamPod', done => {
        kubeClient.streamPod('foo')
            .finally(done);
    });
});
