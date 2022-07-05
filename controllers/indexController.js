exports.index = async(req, res) => {
    try {
        res.redirect('/api');
    } catch (error) {
        console.log(error);
    };
};