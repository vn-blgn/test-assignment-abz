exports.userUrl = function() {
    return `/api/${this.id}/users/${this.userId}`;
};

exports.positionUrl = function() {
    return `/api/${this.id}/positions/${this.positionId}`;
};

exports.positionUrlWithData = function() {
    return `/api/${this.id}/positions/${this.data.positionId}`;
};

exports.customErrorMessage = function() {
    return 'We\'re sorry, something went wrong, try again later.';
};

exports.clientId = function() {
    return this.id;
};

exports.checkAndRender = async(req, res, pool, page, title, data) => {
    const { id } = req.params;
    const { email } = req.decodedData;
    const client = 'select * from auth where authId = ?';
    const [clientData, clientMeta] = await pool.execute(client, [id]);
    const clientEmail = clientData[0].email;
    if (clientEmail === email) {
        res.render(page, { title, id, data });
    } else {
        res.redirect('/');
    };
};

exports.onlyRender = async(res, page, title, action, message) => {
    res.render(page, { title, action, message });
};