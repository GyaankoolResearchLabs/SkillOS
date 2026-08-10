import api from "./api";

// =====================================================
// GET WORKFLOWS
// =====================================================

export const getWorkflows = async () => {
  const response = await api.get(
    "/workflows"
  );

  return response.data;
};

// =====================================================
// CREATE WORKFLOW
// =====================================================

export const createWorkflow = async (
  workflow
) => {
  const response = await api.post(
    "/workflows",
    workflow
  );

  return response.data;
};

// =====================================================
// UPDATE WORKFLOW
// =====================================================

export const updateWorkflow = async (
  id,
  workflow
) => {
  const response = await api.put(
    `/workflows/${id}`,
    workflow
  );

  return response.data;
};

// =====================================================
// DELETE WORKFLOW
// =====================================================

export const deleteWorkflow = async (
  id
) => {
  const response = await api.delete(
    `/workflows/${id}`
  );

  return response.data;
};

// =====================================================
// TOGGLE WORKFLOW
// =====================================================

export const toggleWorkflow = async (
  id
) => {
  const response = await api.patch(
    `/workflows/${id}/toggle`
  );

  return response.data;
};

// =====================================================
// GET WORKFLOW EXECUTIONS
// =====================================================

export const getWorkflowExecutions =
  async (id) => {
    const response = await api.get(
      `/workflows/${id}/executions`
    );

    return response.data;
  };