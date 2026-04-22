import { Router } from "express";
import * as userController from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import {
  createUserSchema,
  updateUserSchema,
  changeRoleSchema,
  banSchema,
  updateProfileSchema,
} from "./user.validation";
import { multerUpload } from "../../config/multer";

const router = Router();

// GET /users/my-profile - MUST come before /users/:id
router.get("/my-profile", authenticate, userController.getMyProfile);

router.patch(
  "/my-profile",
  authenticate,
  validate(updateProfileSchema),
  userController.updateMyProfile
);

router.patch(
  "/my-profile/image",
  authenticate,
  multerUpload.single("image"),
  userController.uploadProfileImage
);

// Admin/Super Admin routes
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  userController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  userController.getById
);

router.post(
  "/create-user",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(createUserSchema),
  userController.createUser
);

router.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(updateUserSchema),
  userController.update
);

router.patch(
  "/:id/role",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(changeRoleSchema),
  userController.changeRole
);

router.patch(
  "/:id/ban",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(banSchema),
  userController.ban
);

router.patch(
  "/:id/unban",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  userController.unban
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  userController.softDelete
);

export default router;
