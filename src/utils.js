import {fileURLToPath} from "url"
import {dirname} from "path"
import multer from "multer"
import bcrypt from "bcrypt"
import { options } from "./config/options.js"
import { Faker, es, en } from '@faker-js/faker'
import winston from 'winston'

const faker = new Faker({ locale: [es] })
const fakerEn = new Faker({ locale: [en] })

const __filepath = fileURLToPath(import.meta.url)
const __dirname = dirname(__filepath)

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,`${__dirname}/public/images`)
    },
    filename: (req,file,cb) =>{
        console.log(file)
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

export const generateProducts = () => {
    const numOfProducts = +faker.string.numeric(1, { bannedDigits: [0] })
    const products = []

    for (let i = 0; i < numOfProducts; i++) {
        products.push({
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            stock: +faker.string.numeric(1),
            id: faker.database.mongodbObjectId(),
            image: faker.image.url(),
            code: faker.string.alphanumeric(10),
            description: ""//fakerEn.commerce.productDescription()
        })
    }
    return products
}

export const createHash = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(options.bcrypt.salt))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
export const uploader = multer({storage})
export default __dirname

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
        http: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'debug',
            format: winston.format.simple()
        }) 
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'info',
            format: winston.format.simple()
        }) 
    ]
})

const environment = options.enviroment

export const addLogger = (req, res, next) => {
    if (environment == 'dev') {
        req.logger = devLogger
    } else if (environment == 'prod') {
        req.logger = prodLogger
    }
    //req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}