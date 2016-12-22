(function () {
    'use strict';

    angular
        .module('app')
        .controller('Edit.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.searchEmp = searchEmp;
        vm.saveEmpl = saveEmpl;
        vm.delEmp = delEmp;
        vm.showTheForm = null;

        initController();

        function initController() {
            // get 
            vm.showTheForm = false;
         
        }
        function searchEmp() {

           UserService.getEmp(vm.user.emp_id).then(function (user) {
                vm.showTheForm =true;
                vm.user = user;

            })
             .catch(function (error) {
                 
                    FlashService.Error(error);
                    vm.showTheForm =false;

                });
        }


        function saveEmpl() {
            UserService.EmpUpdate(vm.user)
                .then(function () {
                    FlashService.Success('Employee updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        function delEmp() {
            //
            UserService.EmpDelete(vm.user.emp_id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();