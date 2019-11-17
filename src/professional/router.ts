import { Router } from "express"
import ProfessionalsController from "./controller"
import routeErrorHandlerWrapper from "../errors/routeErrorHandlerWrapper"

const router = Router()
const controller = new ProfessionalsController()

router.get("/", routeErrorHandlerWrapper(controller.getAll))

export default router
