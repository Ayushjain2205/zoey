export interface Meeting {
  id: string;
  title: string;
  startTime?: number;
  endTime?: number;
  time: string;
  duration: string;
  isOnline: boolean;
  participants: string[];
  location?: string;
  meetingLink?: string;
}

export interface DaySchedule {
  date: string;
  sleepTime: string;
  wakeTime: string;
  activities: {
    time: string;
    activity: string;
    duration: number;
  }[];
  meetings: Meeting[];
}
