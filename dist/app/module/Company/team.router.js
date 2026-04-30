import { Router } from "express";
import { authenticate, authorize } from "@middleware/auth.middleware";
import { teamController } from "./team.controller";
const router = Router();
// Candidate/Member accepting an invite
router.post("/join", authenticate, teamController.acceptInvite);
// Team management endpoints (require RECRUITER or ADMIN roles to manage company team)
// Mount this inside the companies router so paths resolve as /companies/:id/invite, etc.
router.post("/:id/invite", authenticate, authorize(["RECRUITER", "ADMIN"]), teamController.inviteMember);
router.get("/:id/members", authenticate, authorize(["RECRUITER", "ADMIN"]), teamController.getMembers);
router.patch("/:id/members/:userId", authenticate, authorize(["RECRUITER", "ADMIN"]), teamController.updateMemberRole);
router.delete("/:id/members/:userId", authenticate, authorize(["RECRUITER", "ADMIN"]), teamController.removeMember);
export const teamRouter = router;
//# sourceMappingURL=team.router.js.map