const casual = require('casual');

const position_id = [1, 2, 3, 4];
const photo = [
    '/images/user1.jpg',
    '/images/user2.jpg',
    '/images/user3.jpg',
    '/images/user4.jpg',
    '/images/user5.jpg',
    '/images/user6.jpg',
    '/images/user7.jpg',
    '/images/user8.jpg',
    '/images/user9.jpg',
    '/images/user10.jpg',
    '/images/user11.jpg',
    '/images/user12.jpg'
];

casual.define('user', function() {
    return {
        Id: 1,
        name: casual.full_name,
        email: casual.email,
        phone: casual.phone,
        positionId: casual.random_element(position_id),
        photo: casual.random_element(photo),
    };
});

exports.users = function(times) {
    let result = [];

    for (let i = 0; i < times; ++i) {
        const user = casual.user;
        user.Id = i + 1;
        result.push(user);
    }
    return result;
};