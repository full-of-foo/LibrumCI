import Client from 'node-kubernetes-client';
import kubeClient from '../../../app/server/lib/kubeClient';

describe('Lib: kubeClient', () => {
    it('should be correctly instatiated with prototype methods', () => {
        expect(kubeClient).toBeDefined();
        expect(kubeClient.constructor).toBe(Client);

        expect(kubeClient.streamPodUntilPhase).toBeDefined();
        expect(kubeClient.getServiceByName).toBeDefined();
        expect(kubeClient.getPodLogs).toBeDefined();
        expect(kubeClient.deletePod).toBeDefined();
    });
});
