import { Router } from "express"
import BookingController from "./controller"
import routeErrorHandlerWrapper from "../errors/routeErrorHandlerWrapper"

const router = Router()
const controller = new BookingController()

router.post("/", routeErrorHandlerWrapper(controller.post))

export default router
