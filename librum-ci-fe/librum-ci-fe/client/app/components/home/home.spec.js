import HomeModule from './home'

describe('Home', () => {
    let $rootScope, $state, $location, $componentController, $compile;

    beforeEach(window.module(HomeModule));

    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $componentController = $injector.get('$componentController');
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
    }));

    describe('Module', () => {
        it('default component should be home', () => {
            $location.url('/');
            $rootScope.$digest();
            expect($state.current.component).to.eq('home');
        });
    });

    describe('Controller', () => {
        let controller;
        beforeEach(() => {
            controller = $componentController('home', {
                $scope: $rootScope.$new()
            });
        });

        it('has a name property', () => {
            expect(controller).to.have.property('name');
        });
    });

    describe('View', () => {
        let scope, template;

        beforeEach(() => {
            scope = $rootScope.$new();
            template = $compile('<home></home>')(scope);
            scope.$apply();
        });

        it('has hero in template', () => {
            expect(template.find('hero').html()).to.eq('');
        });

    });
});
