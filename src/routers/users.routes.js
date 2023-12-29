import {Router} from "express"
import { validateAdmin } from "../middlewares/validateUsers.js"
import { updateUserRole, getAllUsers, deleteInActiveUsers} from "../controllers/users.controller.js"
const router = Router()

router.get('/', getAllUsers)
router.delete('/', validateAdmin, deleteInActiveUsers)
router.put("/premium/:uid", validateAdmin, updateUserRole)


export default router