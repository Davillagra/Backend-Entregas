import { Router } from "express"

const router = Router()

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile')
    next()
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    next()
}

router.get("/login",publicAccess,(req,res)=>{
    res.render("login")
})

router.get("/signup",publicAccess,(req,res)=>{
    res.render("signup")
})

router.get("/profile",privateAccess, (req,res)=>{
    res.render('profile', {
        user: req.session.user
    })
})

export default router