import RepoModule from './repo'
import RepoController from './repo.controller';
import RepoComponent from './repo.component';
import RepoTemplate from './repo.html';

describe('Repo', () => {
    let $rootScope, makeController;

    beforeEach(window.module(RepoModule));
    beforeEach(inject((_$rootScope_) => {
        $rootScope = _$rootScope_;
        makeController = () => {
            return new RepoController();
        };
    }));

    describe('Controller', () => {
        it('has a name property', () => {
            let controller = makeController();
            expect(controller).to.have.property('name');
        });
    });

    describe('Template', () => {
        it('has name in template', () => {
            expect(RepoTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
        });
    });

    describe('Component', () => {
        let component = RepoComponent;

        it('includes the intended template',() => {
            expect(component.template).to.equal(RepoTemplate);
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(RepoController);
        });
    });
});
