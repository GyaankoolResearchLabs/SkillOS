const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createSOPTemplate,
  getSOPTemplates,
  getSOPTemplateById,
  updateSOPTemplate,
  toggleSOPTemplate,
  duplicateSOPTemplate,
  deleteSOPTemplate,
} = require("../controllers/sopTemplateController");

const router = express.Router();

// =====================================================
// GET ALL SOP TEMPLATES
// =====================================================

router.get(
  "/",
  protect,
  getSOPTemplates
);

// =====================================================
// CREATE SOP TEMPLATE
// =====================================================

router.post(
  "/",
  protect,
  createSOPTemplate
);

// =====================================================
// GET SINGLE SOP TEMPLATE
// =====================================================

router.get(
  "/:id",
  protect,
  getSOPTemplateById
);

// =====================================================
// UPDATE SOP TEMPLATE
// =====================================================

router.put(
  "/:id",
  protect,
  updateSOPTemplate
);

// =====================================================
// TOGGLE ACTIVE / INACTIVE
// =====================================================

router.patch(
  "/:id/toggle",
  protect,
  toggleSOPTemplate
);

// =====================================================
// DUPLICATE TEMPLATE
// =====================================================

router.post(
  "/:id/duplicate",
  protect,
  duplicateSOPTemplate
);

// =====================================================
// DELETE TEMPLATE
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteSOPTemplate
);

module.exports = router;