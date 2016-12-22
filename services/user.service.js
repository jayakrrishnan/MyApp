var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('employee');
var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.addEmp = addEmp;
service.getEmp = getEmp;
service.updateEmp = updateEmp;
service.deleteEm = deleteEm;


module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
           
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function addEmp(userParam) {
    var deferred = Q.defer();

    // validation
    db.employee.findOne(
        { emp_id: userParam.emp_id },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Employee ID "' + userParam.emp_id + '" already exists');
            } else {
                addUser();
            }
        });

    function addUser() {
    
        var user=userParam;
        db.employee.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
           
    }

    return deferred.promise;
}
function getEmp(emp_id) {
    var deferred = Q.defer();
    db.employee.findOne({ emp_id: emp_id}, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'emp_id'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function updateEmp(emp_id, userParam) {
    var deferred = Q.defer();

    // validation
    /* db.employee.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.emp_id !== userParam.emp_id) {
            // username has changed so check if the new username is already taken
            db.employee.findOne(
                { emp_id: userParam.emp_id },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('EmpId "' + req.body.username + '" is already taken')
                    } else {
                        updateEmp();
                    }
                });
        } else {
          updateEmp();  
        }
    });*/
              updateEmp();  

    function updateEmp() {
        // fields to update
    
        db.employee.update(
            { "emp_id": userParam.emp_id },
            { "firstName": userParam.firstName,
            "lastName": userParam.lastName,
            "address":{"c_address":userParam.address.c_address,
                        "p_address":userParam.address.p_address},
            "email":{"email_off":userParam.email.email_off,
                    "email_per":userParam.email.email_per},
            "emp_id": userParam.emp_id,
            "contact": userParam.contact,
            "department": userParam.department,
            "designation": userParam.designation,
            "bas_salary": userParam.bas_salary,
            "hra": userParam.hra,
            "other_allowances": userParam.other_allowances,
            "qualification": userParam.qualification,
            "specialization":userParam.specializations,
            "curr_project": userParam.curr_project,
            "curr_role": userParam.curr_role,
            "annual_leave": userParam.annual_leave,
            "bal_leave": userParam.bal_leave
         },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function deleteEm(_id) {
    var deferred = Q.defer();
    console.log( "here"+ _id);
    db.employee.remove(
       // { emp_id: emp_id },
        {emp_id: _id},
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}