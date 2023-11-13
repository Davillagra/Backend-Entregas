import { Router } from "express"
const router = Router()

router.get("/", (req,res)=>{
    req.logger.fatal("Fatal")
    req.logger.error('Error')
    req.logger.warning('Warning')
    req.logger.info('Info')
    req.logger.debug('Debug')
    req.logger.http('HTTP')
    res.send({message: 'Prueba de logger'})
})

export default router