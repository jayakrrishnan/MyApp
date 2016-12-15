(function () {
    'use strict';

    angular
        .module('app')
        .controller('Employee.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.addEmpl = addEmpl;
        vm.clrEmp = clrEmp;

        initController();

        function initController() {
            // get current user
         
        }

        function addEmpl() {
            UserService.addEmp(vm.user)
                .then(function () {
                    FlashService.Success('Employee added');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        function clrEmp() {
            //
            
        }
    }

})();