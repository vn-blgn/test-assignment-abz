exports.userUrl = function() {
    return `/api/${this.id}/users/${this.userId}`;
};

exports.positionUrl = function() {
    return `/api/${this.id}/positions/${this.positionId}`;
};

exports.customErrorMessage = function() {
    return 'We\'re sorry, something went wrong, try again later.';
};

exports.clientId = function() {
    return this.id;
};
