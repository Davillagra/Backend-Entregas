import chai from "chai"
import supertest from "supertest"
import { options } from "../src/config/options.js"
import { usersModel } from "../src/models/users.js"

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing Ecomerce", ()=>{
        const mockedProduct = [
            {
                category: ["Category3","Category2"],
                title: "Producto para test",
                description: "Descripción del Producto 1",
                price: 19.99,
                thumbnail: "imagen1.jpg",
                code: "PROD0523",
                stock: 50
            }
        ]
        let token = ""
        let createdProductId = []
        let idForTest = ""
        let cartCreatedId = ""
        let mockedUser = {email:"danielsebastianvillagra@hotmail.com",password:"asd"}
        let userCreated = ""
    before( async ()=>{
        const {_body} = await requester.post("/api/sessions/login").send({email:options.user.adminEmail,password:options.user.adminPass})
        token = _body.token
        const productForTest = await requester.post(`/api/products/`).send([
            {
                category: ["Category3","Category2"],
                title: "Producto para test",
                description: "Descripción del Producto 1",
                price: 19.99,
                thumbnail: "imagen1.jpg",
                code: "PROD052945213",
                stock: 50
            }]).set("Authorization", `Bearer ${token}`)
        idForTest = productForTest._body.message[0]._id
    })
    describe("Test de Prodcuts", ()=>{
        it("El endpoint /api/products debe devolver el listado de productos correctamente", async ()=>{
            const {statusCode,ok,_body} = await requester.get("/api/products")
            expect(Array.isArray(_body.payload)).to.be.ok
        })
        it("El endpoint /api/products/:id debe devolver un producto correctamente", async ()=>{
            const {statusCode,ok,_body} = await requester.get(`/api/products/${idForTest}`)
            expect(_body.message._id).to.be.equals(idForTest)
        })
        it("El endpoint /api/products/ debe poder postear un producto", async ()=>{
            const {statusCode,ok,_body} = await requester.post(`/api/products/`).send(mockedProduct).set("Authorization", `Bearer ${token}`)
            expect(statusCode).to.equal(201)
            expect(_body.message).to.be.an("array")
            _body.message.forEach((e) => {
                createdProductId.push(e._id)
                expect(e._id).to.be.ok
            })
        })
        it("El endpoint /api/products/:id debe permitir modificar un producto correctamente", async ()=>{
            const {statusCode,ok,_body} = await requester.put(`/api/products/${idForTest}`).send({stock:10}).set("Authorization", `Bearer ${token}`)
            expect(statusCode).to.be.equal(200)
            expect(_body.info.modifiedCount).to.be.not.equal(0)
        })
        it("El endpoint /api/products/:id debe permitir borrar un producto", async ()=>{
            const {statusCode,ok,_body} = await requester.delete(`/api/products/${idForTest}`).set("Authorization", `Bearer ${token}`)
            expect(statusCode).to.be.equal(200)
            expect(_body.message.deletedCount).to.be.not.equal(0)
            if(statusCode==200){
                idForTest = ""
            }
        })
    })
    describe("Test de Carts", ()=>{
        it("El endpoint /api/carts debe crear un carrito", async ()=>{
            const {statusCode,ok,_body} = await requester.post(`/api/cart/`).set("Authorization", `Bearer ${token}`)
            expect(statusCode).to.be.equal(201)
            expect(_body.id).to.be.ok
            if(_body.id){
                cartCreatedId = _body.id
            }
        })
        it("El endpoint /api/cart/:cid debe devolver el carrito de id especificado", async ()=>{
            const {statusCode,ok,_body} = await requester.get(`/api/cart/${cartCreatedId}`).set("Authorization", `Bearer ${token}`)
            expect(statusCode).to.be.equal(200)
            expect(_body.message._id).to.be.ok
            
        })
        it("El endpoint /api/cart/:cid debe eliminar el carrito especificado", async ()=>{
            const {statusCode,ok,_body} = await requester.delete(`/api/cart/${cartCreatedId}`).set("Authorization", `Bearer ${token}`)
            expect(statusCode).to.be.equal(200)
            if(statusCode==200){
                cartCreatedId = ""
            }
        })
    })
    describe("Test de Sessions", ()=>{
        it("El endpoint /api/sessions/login debe permitir iniciar session", async ()=>{
            const {statusCode,ok,_body} = await requester.post(`/api/sessions/login`).send(mockedUser)
            expect(statusCode).to.be.equal(200)
            expect(_body.token).to.be.ok
        })
        it("El endpoint /api/sessions/signup debe permitir crear un usuario", async ()=>{
            const data = { first_name:"Test", last_name:"Signup", email:"test@signup.com", age:25,role:"user",password:"123"}
            const {statusCode,ok,_body} = await requester.post(`/api/sessions/signup`).send(data)
            if(_body._id){
                userCreated = _body._id
            }
            expect(statusCode).to.be.equal(200)
        })
        it("El endpoint /api/sessions/login debe permitir loguearse como admin si se envian los datos correctos", async ()=>{
            const {statusCode,ok,_body} = await requester.post(`/api/sessions/login`).send({email:options.user.adminEmail,password:options.user.adminPass})
            expect(statusCode).to.be.equal(200)
            expect(_body.token).to.be.ok
        })
    })
    after(async () => {
        if(idForTest){
            await requester.delete(`/api/products/${idForTest}`).set("Authorization", `Bearer ${token}`)
        }
        if (createdProductId) {
            for (const productId of createdProductId) {
                await requester.delete(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`)
            }
        }
        if(cartCreatedId){
            await requester.delete(`/api/cart/${cartCreatedId}`).set("Authorization", `Bearer ${token}`)
        }
        if (userCreated) {
            await requester.delete(`/api/users/delete/${userCreated}`).set("Authorization", `Bearer ${token}`)
        }
    })
})