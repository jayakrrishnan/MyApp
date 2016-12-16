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

           UserService.GetEmp(vm.user.emp_id).then(function (user) {
                vm.showTheForm =true;
                vm.user = user;

            })
             .catch(function (error) {
                    FlashService.Error(error);
                    vm.showTheForm =false;

                });
        }


        function saveEmpl() {
            
        }
        function delEmp() {
            //
            
        }
    }

})();