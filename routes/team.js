const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

/* ══════════════════════════════════════════
   PUBLIC ROUTES  (no auth required)
   Prefix: /api/team
══════════════════════════════════════════ */

/**
 * GET /api/team
 * Returns all Active members — used by public frontend
 */
router.get("/", async (req, res) => {
  try {
    const team = await Team.find({ status: "Active" })
      .sort({ order: 1, createdAt: 1 })
      .select("-__v");

    res.json(team);
  } catch (err) {
    console.error("GET /api/team error:", err.message);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

/* ══════════════════════════════════════════
   ADMIN ROUTES  (add your auth middleware)
   Prefix: /api/admin/team
══════════════════════════════════════════ */

/**
 * GET /api/admin/team
 * Returns ALL members regardless of status — used by admin portal
 */
router.get("/admin", async (req, res) => {
  try {
    const team = await Team.find()
      .sort({ order: 1, createdAt: 1 })
      .select("-__v");

    res.json(team);
  } catch (err) {
    console.error("GET /api/admin/team error:", err.message);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

/**
 * POST /api/admin/team
 * Create a new team member
 * Body: { name, role, email, department, status, avatar, joined, projects, order }
 */
router.post("/admin", async (req, res) => {
  try {
    const { name, role, email, department, status, avatar, projects, order } =
      req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check duplicate email
    const existing = await Team.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res
        .status(409)
        .json({ error: "A member with this email already exists" });
    }

    // Auto-format joined date if not provided
    const joined =
      req.body.joined ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

    const member = await Team.create({
      name: name.trim(),
      role: role?.trim() || "",
      email: email.toLowerCase().trim(),
      department: department?.trim() || "",
      status: status || "Active",
      avatar: avatar || null,
      joined,
      projects: Number(projects) || 0,
      order: Number(order) || 0,
    });

    res.status(201).json(member);
  } catch (err) {
    console.error("POST /api/admin/team error:", err.message);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create team member" });
  }
});

/**
 * PATCH /api/admin/team/:id
 * Update an existing team member
 * Body: any subset of { name, role, email, department, status, avatar, joined, projects, order }
 */
router.patch("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = [
      "name",
      "role",
      "email",
      "department",
      "status",
      "avatar",
      "joined",
      "projects",
      "order",
    ];

    // Build update object — only include fields that were sent
    const update = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    });

    // Normalize email if being updated
    if (update.email) {
      update.email = update.email.toLowerCase().trim();

      // Check duplicate email (exclude current member)
      const existing = await Team.findOne({
        email: update.email,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(409)
          .json({ error: "Email already used by another member" });
      }
    }

    const member = await Team.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    res.json(member);
  } catch (err) {
    console.error("PATCH /api/admin/team/:id error:", err.message);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to update team member" });
  }
});

/**
 * DELETE /api/admin/team/:id
 * Permanently delete a team member
 */
router.delete("/admin/:id", async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    res.json({ success: true, message: `${member.name} has been removed` });
  } catch (err) {
    console.error("DELETE /api/admin/team/:id error:", err.message);
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

/**
 * PATCH /api/admin/team/:id/status
 * Quick status toggle — Active / On Leave / Inactive
 */
router.patch("/admin/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Active", "On Leave", "Inactive"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    const member = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true },
    ).select("-__v");

    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    res.json(member);
  } catch (err) {
    console.error("PATCH /api/admin/team/:id/status error:", err.message);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
