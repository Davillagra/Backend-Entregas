import passport from "passport"
import local from "passport-local"
import { usersModel } from "../models/users.js"
import { createHash, isValidPassword } from "../utils.js"
import gitHubStrategy from "passport-github2"

const LocalStrategy = local.Strategy
const GitHubStrategy = gitHubStrategy.Strategy
const initializePassport = () => {
  passport.use("signup",new LocalStrategy({ passReqToCallback: true, usernameField: "email" },async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
          let user = await usersModel.findOne({ email })
          if (user) {
            console.log("user already exists")
            return done(null, false)
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          }
          let result = await usersModel.create(newUser)
          return done(null, result)
        } catch (error) {
          return done("Error obtaining users info" + error)
        }
      }
    )
  )
  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
        const user = await usersModel.findOne({email: username})
        if (!user) {
            console.log("User not found")
            return done(null, false)
        }
        if (!isValidPassword(user, password)) {
            return done(null, false)
        }
        return done(null, user)
    } catch (error) {
        return done(error)
    }
  }))
  passport.use('github',new GitHubStrategy({
    clientID:"Iv1.e55f37e49ed92430",
    clientSecret:"338619de4208a3e7e28c07d5f54e49f9040f77d9",
    callBackURL:"https://localhost:8080/api/sessions/githubcallback"
  }, async (accessToken,refreshToken,profile,done)=>{
    try {
      let user = await usersModel.findOne({ userName: profile._json.login})
      if (!user) {
          let newUser = { first_name: profile._json.name, userName: profile._json.login, email: profile._json.email}
          let result = await usersModel.create(newUser);
          return done(null, result);
      }
      done(null, user)
    } catch (error) {
      return done(error)
    }
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    let user = await usersModel.findById(id)
    done(null, user)
  })
}

export default initializePassport