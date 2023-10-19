
export  const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile')
    next()
}

export  const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    next()
}

export const login = (req,res)=>{
    res.render("login")
}

export const signup = (req,res)=>{
    res.render("signup")
}

export const profile = (req,res)=>{
    res.render('profile', {
        user: req.session.user
    })
}