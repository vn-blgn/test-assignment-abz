const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const poolCon = require("../lib/createConnect");
const dbloader = require('../lib/dbloader');

exports.login_get = async(req, res) => {
    try {
        res.render('api', {
            title: 'Log in',
            action: 'Log in or <a href="/api/registration">register</a>'
        });
    } catch (error) {
        console.log(error);
    };
};

exports.login_post = async(req, res) => {
    try {
        const checkEmail = 'select * from auth where email = ?';
        const email = [req.body.email];

        const pool = poolCon.createConnect();

        const [candidate, candidateMeta] = await pool.execute(checkEmail, email);

        if (candidate[0]) {
            const password = bcrypt.compareSync(req.body.password, candidate[0].password);

            if (password) {
                const token = jwt.sign({
                    email: candidate[0].email,
                    id: candidate[0].authId
                }, process.env.PRIVATEKEY, { expiresIn: "24h" });

                res.cookie('token', token, { path: '/api', httpOnly: true});
                res.redirect(`/api/${candidate[0].authId}`);
            } else {
                res.render('api', {
                    title: 'Log in',
                    message: 'Invalid password!',
                    action: 'Log in or <a href="/api/registration">register</a>'
                });
            };

        } else {
            res.render('api', {
                title: 'Log in',
                message: 'User not found!',
                action: 'Log in or <a href="/api/registration">register</a>'
            });
        };
    } catch (error) {
        console.log(error);
    };
};

exports.registration_get = async(req, res) => {
    try {
        res.render('api', {
            title: 'Registration',
            action: 'Register or <a href="/">log in</a>'
        });
    } catch (error) {
        console.log(error);
    };
};

exports.registration_post = async(req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt);
        const insertNewUser = 'insert auth(email, password) values (?,?)';
        const newUser = [req.body.email, password];
        const checkEmail = 'select * from auth where email = ?';
        const email = [req.body.email];

        const pool = poolCon.createConnect();

        const [candidate, candidateMeta] = await pool.execute(checkEmail, email);

        if (candidate[0]) {
            res.render('api', {
                title: 'Registration',
                message: 'This user already exists!',
                action: 'Register or <a href="/">log in</a>'
            });
        } else {
            const [userData, userMeta] = await pool.execute(insertNewUser, newUser);

            const [getUserData, getUserMeta] = await pool.execute(checkEmail, email);
            const authId = getUserData[0].authId;

            const createTabPositions = `create table ${authId}_positions
            (
                positionId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                position VARCHAR(20) NOT NULL
            )`;
            const [tabPositionsData, tabPositionsMeta] = await pool.execute(createTabPositions);

            const insPositions = `INSERT ${authId}_positions(positionId, position) VALUES
            (1, 'Lawyer'), (2, 'Content manager'), (3, 'Security'), (4, 'Designer')`;
            const [insPositionsData, insPositionsMeta] = await pool.execute(insPositions);

            const createTabUsers = `create table ${authId}_users
            (
                userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL,
                email VARCHAR(320) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                positionId INT NOT NULL,
                photo varchar(500) NOT NULL
            )`;
            const [tabUsersData, tabUsersMeta] = await pool.execute(createTabUsers);

            res.redirect('/');
        };
    } catch (error) {
        console.log(error);
    };
};

exports.get_more = async(req, res) => {
    try {

        const pool = poolCon.createConnect();

        const selSix = `SELECT * FROM ${req.body.id}_users LIMIT ${req.body.start}, 6`;

        const [data, meta] = await pool.execute(selSix);

        res.json({ users: data });
    } catch (error) {
        console.log(error);
    };
};

exports.client_page = async(req, res) => {
    try {
        const client = 'select * from auth where authId = ?';
        const authId = [req.params.id];

        const pool = poolCon.createConnect();

        const [clientData, clientMeta] = await pool.execute(client, authId);

        res.render('client_page', {
            title: clientData[0].email,
            id: clientData[0].authId
        });
    } catch (error) {
        console.log(error);
    };
};

exports.uploadUsers = async(req, res) => {
    try {
        const id = req.params.id;

        const users = dbloader.users(45);

        const pool = poolCon.createConnect();

        const selCount = `SELECT COUNT(*) FROM ${id}_users`;

        const [countData, countMeta] = await pool.query(selCount);
        const count = countData[0]['COUNT(*)'];

        const values = users.map(user => `(
            ${user.Id}, '${user.name}', '${user.email}', '${user.phone}', ${user.positionId}, '${user.photo}'
            )`);

        const uploadData = `insert ${id}_users(userId, name, email, phone, positionId, photo) 
        VALUES ${values.join(', ')};`

        if (count == 0) {
            const [insUploadData, insUploadMeta] = await pool.execute(uploadData);
        };

        res.redirect(`/api/${id}/users`);
    } catch (error) {
        console.log(error);
    };
};

exports.users_get = async(req, res) => {
    try {
        const id = req.params.id;

        const pool = poolCon.createConnect();

        const selAll = `SELECT * FROM ${id}_users LIMIT 0, 6`;

        const [data, meta] = await pool.execute(selAll);

        data.forEach(elem => elem.id = id);

        res.render('users', {
            title: 'Users page',
            users: data,
            id
        });
    } catch (error) {
        console.log(error);
    };
};

exports.user_detail = async(req, res) => {
    try {
        const pool = poolCon.createConnect();

        const client_id = req.params.id;
        const user_id = req.params.user_id;

        const selUser = `SELECT * FROM ${client_id}_users WHERE userId = ${user_id}`;

        const [userData, userMeta] = await pool.execute(selUser);

        const selPosition = `SELECT * FROM ${client_id}_positions WHERE PositionId = ${userData[0].positionId}`;

        const [positionData, positionMeta] = await pool.execute(selPosition);

        res.render("user_detail.hbs", {
            title: userData[0].name,
            position: positionData[0].position,
            positionId: positionData[0].positionId,
            phone: userData[0].phone,
            email: userData[0].email,
            photo: userData[0].photo,
            id: req.params.id
        });
    } catch (error) {
        console.log(error);
    };
};

exports.positions_get = async(req, res) => {
    try {
        const id = req.params.id;

        const pool = poolCon.createConnect();

        const selAll = `SELECT * FROM ${id}_positions`;

        const [data, meta] = await pool.execute(selAll);

        data.forEach(elem => elem.id = id);

        res.render('positions', {
            title: 'Positions page',
            positions: data,
            id
        });
    } catch (error) {
        console.log(error);
    };
};

exports.position_detail = async(req, res) => {
    try {
        const pool = poolCon.createConnect();

        const client_id = req.params.id;
        const position_id = req.params.position_id;

        const selPosition = `SELECT * FROM ${client_id}_positions WHERE positionId = ${position_id}`;
        const selUsers = `SELECT * FROM ${client_id}_users WHERE positionId = ${position_id}`;

        const [positionData, positionMeta] = await pool.execute(selPosition);
        const [usersData, usersMeta] = await pool.execute(selUsers);

        usersData.forEach(elem => elem.id = client_id);

        res.render("position_detail.hbs", {
            title: positionData[0].position,
            users: usersData,
            id: client_id
        });
    } catch (error) {
        console.log(error);
    };
};

exports.user_create_get = async(req, res) => {
    try {
        const client_id = req.params.id;
        const selAll = `SELECT * FROM ${client_id}_positions`;

        const pool = poolCon.createConnect();

        const [data, meta] = await pool.execute(selAll);

        res.render('user_form.hbs', {
            title: 'Add user',
            users: data
        });
    } catch (error) {
        console.log(error);
    };
};

exports.user_create_post = async(req, res) => {
    try {
        const client_id = req.params.id;
        const user = [req.body.name, req.body.email, req.body.phone, req.body.position, `/images/${req.file.originalname}`];
        const insertUser = `insert ${client_id}_users(name, email, phone, positionId, photo) values (?,?,?,?,?)`;

        const pool = poolCon.createConnect();

        const [data, meta] = await pool.execute(insertUser, user);

        res.redirect(`users/${data.insertId}`);
    } catch (error) {
        console.log(error);
    };
};

exports.get_token = async(req, res) => {
    try {
        const token = req.cookies.token;

        res.json(token);
    } catch (error) {
        console.log(error);
    };
};

exports.get_users = async(req, res) => {
    try {
        const id = req.params.id;

        const pool = poolCon.createConnect();

        const selectUsersAndPositions = `select 
        ${id}_users.userId, ${id}_users.name, ${id}_users.email, ${id}_users.phone, ${id}_positions.position 
        from ${id}_users join ${id}_positions 
        on ${id}_users.positionId=${id}_positions.positionId`;

        const [data, meta] = await pool.execute(selectUsersAndPositions);

        res.json(data);
    } catch (error) {
        console.log(error);
    };
};