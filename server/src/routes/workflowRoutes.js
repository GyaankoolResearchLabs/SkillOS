const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  toggleWorkflow,
  getWorkflowExecutions,
} = require("../controllers/workflowController");

const router = express.Router();

// =====================================================
// GET WORKFLOWS
// =====================================================

router.get(
  "/",
  protect,
  getWorkflows
);

// =====================================================
// CREATE WORKFLOW
// =====================================================

router.post(
  "/",
  protect,
  createWorkflow
);

// =====================================================
// UPDATE WORKFLOW
// =====================================================

router.put(
  "/:id",
  protect,
  updateWorkflow
);

// =====================================================
// DELETE WORKFLOW
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteWorkflow
);

// =====================================================
// TOGGLE WORKFLOW
// =====================================================

router.patch(
  "/:id/toggle",
  protect,
  toggleWorkflow
);

// =====================================================
// EXECUTION HISTORY
// =====================================================

router.get(
  "/:id/executions",
  protect,
  getWorkflowExecutions
);

module.exports = router;