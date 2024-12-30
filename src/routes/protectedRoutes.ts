import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";
import {
  createFinCategoriesController,
  createFinRecordsController,
  editFinCategoriesController,
  getFinCategoriesController,
  getFinRecordsByMonthYearController,
  getFinRecordsController,
} from "../controllers/financeController";
import { checkHabitStatusForDay, createHabit, deleteHabit, getDailyHabitProgress, getHabits, markHabitDailyProgress, updateHabitDays } from "../controllers/habitsController";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/financial-categories",
  authenticate,
  createFinCategoriesController
);
router.get("/financial-categories", authenticate, getFinCategoriesController);
router.put(
  "/financial-categories/:id",
  authenticate,
  editFinCategoriesController
);

router.post("/financial-records", authenticate, createFinRecordsController);
router.get("/financial-records", authenticate, getFinRecordsController);

router.get("/financial-records/month", authenticate, getFinRecordsByMonthYearController);

router.post("/habits", authenticate, createHabit);
router.put("/habits/:habitId/days", authenticate, updateHabitDays);
router.get("/habits", authenticate, getHabits);
router.delete("/habits/:habitId", authenticate, deleteHabit);

router.get("/habits-records/:habitId/records" , authenticate, checkHabitStatusForDay );


router.post("/habits-records/:habitId/records", authenticate, markHabitDailyProgress);



export default router;
