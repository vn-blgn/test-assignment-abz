const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/', apiController.login_get);
router.post('/', apiController.login_post);

router.get('/registration', apiController.registration_get);
router.post('/registration', apiController.registration_post);

router.post('/more', apiController.get_more);

router.get('/:id/upload', apiController.uploadUsers);
router.get('/:id/users', apiController.users_get);
router.get('/:id/users/:user_id', apiController.user_detail);
router.get('/:id/positions', apiController.positions_get);
router.get('/:id/positions/:position_id', apiController.position_detail);
router.get('/:id/create', apiController.user_create_get);
router.post('/:id/create', apiController.user_create_post);
router.get('/:id/gettoken', apiController.get_token);
router.get('/:id/getusers', apiController.get_users);

router.get('/:id', apiController.client_page);

module.exports = router;