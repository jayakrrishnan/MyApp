﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.addEmp = addEmp;
        service.getEmp = getEmp;
        service.updateEmp = updateEmp;
        service.DeleteEmp = DeleteEmp;

        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function addEmp(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function getEmp(emp_id) {
             return $http.get('/api/users/' + emp_id).then(handleSuccess, handleError);
        }

        function updateEmp(user) {
            return $http.put('/api/users/emp/' + user.emp_id,user).then(handleSuccess, handleError);
        }

        function DeleteEmp(user) {
            return $http.delete('/api/users/emp/' + user.emp_id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
