import api from "./api";

// =======================================
// Manager Dashboard
// =======================================

const getManagerDashboard = () => {
  return api.get("/dashboard");
};

// =======================================
// Employee Dashboard
// =======================================

const getEmployeeDashboard = () => {
  return api.get("/dashboard/employee");
};

// =======================================
// Submit Induction Assessment
// =======================================

const completeInductionItem = (
  inductionId,
  answers
) => {
  return api.post(
    `/dashboard/employee/onboarding/assessment/${inductionId}`,
    {
      answers,
    }
  );
};

// =======================================
// Sync Existing Employee Onboarding
// =======================================

const syncEmployeeOnboarding = () => {
  return api.patch(
    "/employees/sync-existing-onboarding"
  );
};

// =======================================
// Export
// =======================================

export default {
  getManagerDashboard,
  getEmployeeDashboard,
  completeInductionItem,
  syncEmployeeOnboarding,
};