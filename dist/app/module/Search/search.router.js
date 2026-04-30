import { Router } from "express";
import { searchController } from "./search.controller";
const router = Router();
// Public routes for search autocomplete and trending
router.get("/suggestions", searchController.getSuggestions);
router.get("/trending", searchController.getTrending);
export const searchRouter = router;
//# sourceMappingURL=search.router.js.map