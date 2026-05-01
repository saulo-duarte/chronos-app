import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Task } from "../types";

// ─── Constants ───────────────────────────────────────────────────────
const REMINDER_MINUTES_BEFORE = 15;
const DAILY_SUMMARY_HOUR = 7;

const ChannelId = {
  REMINDERS: "task-reminders",
  ALARMS: "task-alarms",
  DAILY: "daily-summary",
} as const;

// ─── Foreground Handler ──────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Notification Data Shape ─────────────────────────────────────────
interface TaskNotificationData {
  taskId: string;
  screen: "ItemDetail";
  type: "TASK";
  item: string; // JSON-stringified Task (expo data must be serializable)
}

function buildTaskNotificationData(task: Task): TaskNotificationData {
  return {
    taskId: task.id,
    screen: "ItemDetail",
    type: "TASK",
    item: JSON.stringify(task),
  };
}

// ─── Identifier helpers ─────────────────────────────────────────────
function reminderId(taskId: string): string {
  return `reminder-${taskId}`;
}

function alarmId(taskId: string): string {
  return `alarm-${taskId}`;
}

// ─── Service ─────────────────────────────────────────────────────────
export const NotificationService = {
  /**
   * Create Android notification channels.
   * Must be called once on app startup before scheduling any notification.
   */
  initializeChannels: async () => {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync(ChannelId.REMINDERS, {
      name: "Lembretes de tarefas",
      description: "Notificações 15 min antes do horário da tarefa",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
    });

    await Notifications.setNotificationChannelAsync(ChannelId.ALARMS, {
      name: "Alarmes de tarefas",
      description: "Alarme no horário exato da tarefa",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 500, 200, 500, 200, 500],
      enableVibrate: true,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
    });

    await Notifications.setNotificationChannelAsync(ChannelId.DAILY, {
      name: "Resumo diário",
      description: "Resumo das tarefas do dia às 6h",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    });
  },

  // ─── Permissions ─────────────────────────────────────────────────
  requestPermissions: async (): Promise<boolean> => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  },

  // ─── Schedule Reminder (15 min before) ────────────────────────────
  scheduleTaskReminder: async (task: Task): Promise<string | null> => {
    const startTime = new Date(task.start_time);
    if (isNaN(startTime.getTime())) return null;

    const triggerDate = new Date(startTime);
    triggerDate.setMinutes(triggerDate.getMinutes() - REMINDER_MINUTES_BEFORE);

    if (triggerDate.getTime() <= Date.now()) return null;

    const identifier = await Notifications.scheduleNotificationAsync({
      identifier: reminderId(task.id),
      content: {
        title: `⏰ Lembrete: ${task.title}`,
        body: `Sua tarefa começa em ${REMINDER_MINUTES_BEFORE} minutos.`,
        data: buildTaskNotificationData(task) as unknown as Record<
          string,
          unknown
        >,
        sound: true,
        ...(Platform.OS === "android" && {
          channelId: ChannelId.REMINDERS,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    return identifier;
  },

  // ─── Schedule Alarm (exact start_time) ────────────────────────────
  scheduleTaskAlarm: async (task: Task): Promise<string | null> => {
    const startTime = new Date(task.start_time);
    if (isNaN(startTime.getTime())) return null;

    if (startTime.getTime() <= Date.now()) return null;

    const identifier = await Notifications.scheduleNotificationAsync({
      identifier: alarmId(task.id),
      content: {
        title: `🔔 Hora da tarefa: ${task.title}`,
        body: task.description || "É agora! Sua tarefa começou.",
        data: buildTaskNotificationData(task) as unknown as Record<
          string,
          unknown
        >,
        sound: true,
        ...(Platform.OS === "android" && {
          channelId: ChannelId.ALARMS,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: startTime,
      },
    });

    return identifier;
  },

  // ─── Schedule Daily Summary (6 AM) ────────────────────────────────
  scheduleDailySummary: async (taskCount: number, taskTitles: string[]): Promise<string | null> => {
    if (taskCount === 0) return null;

    // Cancel any existing daily summary first
    try {
      await Notifications.cancelScheduledNotificationAsync("daily-summary");
    } catch {
      // Ignore if doesn't exist
    }

    const now = new Date();
    const trigger = new Date(now);
    trigger.setHours(DAILY_SUMMARY_HOUR, 0, 0, 0);

    // If 6 AM already passed today, schedule for tomorrow
    if (trigger.getTime() <= now.getTime()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    // Prepare body with task names (max 3)
    let body = `Você tem ${taskCount} tarefa${taskCount > 1 ? "s" : ""} programada${taskCount > 1 ? "s" : ""} para hoje.`;
    
    if (taskTitles.length > 0) {
      const displayTitles = taskTitles.slice(0, 3);
      body += "\n\n📋 Principais tarefas:\n" + displayTitles.map(t => `• ${t}`).join("\n");
      if (taskTitles.length > 3) {
        body += `\n...e mais ${taskTitles.length - 3} taredas`;
      }
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      identifier: "daily-summary",
      content: {
        title: "📋 Resumo do dia",
        body: body,
        sound: true,
        ...(Platform.OS === "android" && {
          channelId: ChannelId.DAILY,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });

    return identifier;
  },

  // ─── Cancel a specific task's notifications ───────────────────────
  cancelTaskNotifications: async (taskId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(reminderId(taskId));
    } catch {
      // Ignore
    }
    try {
      await Notifications.cancelScheduledNotificationAsync(alarmId(taskId));
    } catch {
      // Ignore
    }
  },

  // ─── Sync: cancel all task notifications and reschedule ───────────
  syncTaskNotifications: async (tasks: Task[]): Promise<void> => {
    // Get all currently scheduled notifications
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    // Cancel only task-related notifications (keep daily-summary)
    const taskNotificationIds = scheduled
      .filter(
        (n) =>
          n.identifier.startsWith("reminder-") ||
          n.identifier.startsWith("alarm-")
      )
      .map((n) => n.identifier);

    await Promise.all(
      taskNotificationIds.map((id) =>
        Notifications.cancelScheduledNotificationAsync(id)
      )
    );

    // Filter pending tasks with a future start_time
    const now = Date.now();
    const pendingFutureTasks = tasks.filter((task) => {
      if (task.status === "DONE") return false;
      const startTime = new Date(task.start_time);
      if (isNaN(startTime.getTime())) return false;
      return startTime.getTime() > now;
    });

    // Schedule reminder + alarm for each
    await Promise.all(
      pendingFutureTasks.flatMap((task) => [
        NotificationService.scheduleTaskReminder(task),
        NotificationService.scheduleTaskAlarm(task),
      ])
    );

    // Schedule daily summary with today's task count
    const today = new Date();
    const todayTasks = tasks.filter((task) => {
      const startTime = new Date(task.start_time);
      if (isNaN(startTime.getTime())) return false;
      return (
        task.status !== "DONE" &&
        startTime.getDate() === today.getDate() &&
        startTime.getMonth() === today.getMonth() &&
        startTime.getFullYear() === today.getFullYear()
      );
    });

    await NotificationService.scheduleDailySummary(
      todayTasks.length, 
      todayTasks.map(t => t.title)
    );
  },

  // ─── Cancel everything ────────────────────────────────────────────
  cancelAll: async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
