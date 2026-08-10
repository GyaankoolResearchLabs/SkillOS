import api from "./api";

// =====================================================
// GET AUDIT LOGS
// =====================================================

export const getAuditLogs = async (params = {}) => {
  const response = await api.get("/audit-logs", {
    params,
  });

  return response.data;
};

// =====================================================
// GET AUDIT LOG BY ID
// =====================================================

export const getAuditLogById = async (id) => {
  const response = await api.get(`/audit-logs/${id}`);

  return response.data;
};

// =====================================================
// GET AUDIT LOG SUMMARY
// =====================================================

export const getAuditLogSummary = async () => {
  const response = await api.get("/audit-logs/summary");

  return response.data;
};