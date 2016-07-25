import Client from 'node-kubernetes-client';
import kubeClient from '../../../app/server/lib/kubeClient';

describe('Lib: kubeClient', () => {
    it('should be correctly instatiated', () => {
        expect(kubeClient).toBeDefined();
        expect(kubeClient.constructor).toBe(Client);
    });
});
