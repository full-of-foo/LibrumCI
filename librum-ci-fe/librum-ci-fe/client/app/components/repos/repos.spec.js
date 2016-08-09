import ReposModule from './repos';
import ReposController from './repos.controller';
import ReposComponent from './repos.component';
import ReposTemplate from './repos.html';

describe('Repos', () => {
    let $rootScope, makeController;

    beforeEach(window.module(ReposModule));
    beforeEach(inject((_$rootScope_) => {
        $rootScope = _$rootScope_;
        makeController = () => {
            return new ReposController();
        };
    }));

    describe('Template', () => {
        it('has Repositories in template', () => {
            expect(ReposTemplate).to.contain('Repositories');
        });
    });

    describe('Component', () => {
        const component = ReposComponent;

        it('includes the intended template',() => {
            expect(component.template).to.equal(ReposTemplate);
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(ReposController);
        });
    });
});
