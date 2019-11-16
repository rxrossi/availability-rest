import { Router } from "express"
import ProfessionalsController from "./controller"

const router = Router()
const controller = new ProfessionalsController()

router.get("/", controller.getAll)

export default router
