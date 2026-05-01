import { useEffect, useRef } from "react";
import { useTasks } from "./use-tasks";
import { NotificationService } from "../services/notification.service";

/**
 * Synchronizes local notifications with the current task list.
 *
 * Mount this hook once in a component that is rendered only when the
 * user is authenticated (e.g. AppNavigator after login).
 *
 * Every time the task list changes (cache invalidation, refetch, etc.)
 * this hook cancels stale notifications and reschedules for pending
 * future tasks.
 */
export function useTaskNotifications(): void {
  const { data: tasks } = useTasks();
  const hasInitialized = useRef(false);

  // Initialize channels + request permission once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      await NotificationService.initializeChannels();
      await NotificationService.requestPermissions();
    };

    init();
  }, []);

  // Re-sync whenever the task list changes
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    NotificationService.syncTaskNotifications(tasks);
  }, [tasks]);
}
