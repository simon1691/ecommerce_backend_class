import {Router} from "express"
import { validateAdmin } from "../middlewares/validateUsers.js"
import { updateUserRole} from "../controllers/users.controller.js"
const router = Router()

router.put("/premium/:uid", validateAdmin, updateUserRole)

export default router