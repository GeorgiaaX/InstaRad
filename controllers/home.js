module.exports = {
    //get login page
    getLogin: (req, res) => {
        //if user logged in, redirect to feed
        if(req.user) {
            return res.redirect('/feed')
        }
        //render login page
        res.render(
            'login',
            {
                layout: 'landing' //change layout
            }
        )
    },
}