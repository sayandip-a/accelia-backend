const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.get("/", teamController.getActiveTeam);
router.get("/admin", teamController.getAllTeam);
router.post("/admin", teamController.createMember);
router.patch("/admin/:id", teamController.updateMember);
router.delete("/admin/:id", teamController.deleteMember);
router.patch("/admin/:id/status", teamController.updateMemberStatus);

module.exports = router;
