module.exports = {
    getLogin: (req, res) => {
        if(req.user) {
            return res.redirect('/feed')
        }
        res.render(
            'login',
            {
                layout: 'landing' //change layout
            }
        )
    },
}