import exporess from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import mahasiswaController from "../controllers/mahasiswa.controller";
import fictionController from "../controllers/fiction.controller";
const router = exporess.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

// Mahasiswa

// router.post("/mahasiswa", mahasiswaController.createMahasiswa);
// router.get("/mahasiswa", mahasiswaController.getAllMahasiswa);

// Fiction
router.post("/fiction", fictionController.createFiction);
router.post("/fiction/generate", fictionController.generateFiction);
router.post("/fiction/generate-image", fictionController.generateImage);

export default router;
