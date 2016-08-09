import AboutModule from './about'

describe('About', () => {
    let $rootScope, $state, $location, $componentController, $compile;

    beforeEach(window.module(AboutModule));

    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $componentController = $injector.get('$componentController');
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
    }));

    describe('Module', () => {
        it('About component should be visible when navigates to /about', () => {
            $location.url('/about');
            $rootScope.$digest();
            expect($state.current.component).to.eq('about');
        });
    });

    describe('Controller', () => {
        let controller;
        beforeEach(() => {
            controller = $componentController('about', {
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
            template = $compile('<about></about>')(scope);
            scope.$apply();
        });

        it('has About Us in template', () => {
            expect(template.find('h1').html()).to.eq('About Us');
        });

    });
});
