
export  const publicAccess = (req, res, next) => {
    next()
}

export  const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    next()
}

export  const adminAccess = (req, res, next) => {
    if (req.session.user.role === "admin") {
        next()
    } else {
        return res.redirect('/products')
    }
}
export  const userAccess = (req, res, next) => {
    if (req.session.user.role === "user") {
        next()
    } else {
        return res.redirect('/profile')
    }  
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