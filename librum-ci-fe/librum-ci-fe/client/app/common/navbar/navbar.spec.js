import NavbarModule from './navbar'

describe('Navbar', () => {
    let $rootScope, $state, $location, $componentController, $compile;

    beforeEach(window.module(NavbarModule));

    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $componentController = $injector.get('$componentController');
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
    }));

    describe('Controller', () => {
        let controller;
        beforeEach(() => {
            controller = $componentController('navbar', {
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
            template = $compile('<navbar></navbar>')(scope);
            scope.$apply();
        });

        it('has app title in template', () => {
            expect(template.find('a').html()).to.eq('Librum CI');
        });

    });
});
