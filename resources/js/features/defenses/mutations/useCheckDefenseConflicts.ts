// resources/js/features/defenses/mutations/useCheckDefenseConflicts.ts
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface CheckConflictsPayload {
  defenseId: number;
  panelist_ids: number[];
  proposed_date: string;
  start_time: string;
  end_time: string;
  room_id: number;
}

interface ConflictData {
  has_conflict: boolean;
  conflicts: any[];
  message: string;
}

interface CheckConflictsResponse {
  success: boolean;
  data: {
    room_conflicts: ConflictData;
    panelist_conflicts: ConflictData;
    has_any_conflicts: boolean;
    occupied_slots: Array<{ defense_id: number; title: string; start_time: string; end_time: string }>;
  };
}

const checkDefenseConflicts = async (payload: CheckConflictsPayload): Promise<CheckConflictsResponse> => {
  const { defenseId, ...data } = payload;
  const response = await apiClient.post(`/defenses/${defenseId}/check-conflicts`, data);
  return response.data;
};

export const useCheckDefenseConflicts = () => {
  return useMutation({
    mutationFn: checkDefenseConflicts,
  });
};
