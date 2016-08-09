import HeroModule from './hero';
import HeroController from './hero.controller';
import HeroComponent from './hero.component';
import HeroTemplate from './hero.html';

describe('Hero', () => {
    let $rootScope, makeController;

    beforeEach(window.module(HeroModule));
    beforeEach(inject((_$rootScope_) => {
        $rootScope = _$rootScope_;
        makeController = () => {
            return new HeroController();
        };
    }));

    describe('Controller', () => {
        it('has a name property', () => {
            const controller = makeController();
            expect(controller).to.have.property('name');
        });
    });

    describe('Template', () => {
        it('has text in template', () => {
            expect(HeroTemplate).to.contain('Your webhook listener URL is');
        });
    });

    describe('Component', () => {
        const component = HeroComponent;

        it('includes the intended template',() => {
            expect(component.template).to.equal(HeroTemplate);
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(HeroController);
        });
    });
});
