const compare = require('tsscmp');

let users = [{name: "admin", pass: "admin"},
             {name: "piloteers", pass: "piloteers"}];

function check(user1, user2) {
    let valid = true;
    
    valid = compare(user1.name, user2.name) && valid;
    valid = compare(user1.pass, user2.pass) && valid;

    return valid;
};

const validateUser = function (user) {
    let valid = false;
    users.forEach( savedUser => {
        
        if(check(savedUser, user)) valid = true ;

    })
    return valid;
}

module.exports = validateUser;