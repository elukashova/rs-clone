import { ActivityResponse, FriendData } from '../app/loader/loader-responses.types';

export function getClassNames(baseName: string, addName: string | undefined): string {
  return addName ? `${baseName} ${addName}` : baseName;
}

export function convertRegexToPattern(regex: RegExp): string {
  return regex.toString().slice(1, -1);
}

export function provideRandomUsers(data: FriendData[], limit: number): FriendData[] {
  const uniqueUsers: FriendData[] = [];

  while (uniqueUsers.length < limit) {
    const index: number = Math.floor(Math.random() * data.length);
    if (!uniqueUsers.includes(data[index])) {
      uniqueUsers.push(data[index]);
    }
  }

  return uniqueUsers;
}

export function transformNameFormat(name: string): string {
  const username: string[] = name.split(' ');
  for (let i: number = 0; i < username.length; i += 1) {
    username[i] = username[i].charAt(0).toUpperCase() + username[i].slice(1).toLowerCase();
  }
  return username.join(' ');
}

export function getFirstAndLastDaysOfWeek(): Date[] {
  const currentDate: Date = new Date();
  const sundayIndex: number = 6;
  const currentDateClone: number = currentDate.getDay();
  // eslint-disable-next-line max-len
  const difference: number = currentDate.getDate() - currentDateClone + (currentDateClone === 0 ? -6 : 1);
  const currentMonday: Date = new Date(currentDate.setDate(difference));
  const currentSunday: Date = new Date(currentMonday);
  currentSunday.setDate(currentSunday.getDate() + sundayIndex);
  currentMonday.setHours(0, 0, 0, 0);
  currentSunday.setHours(23, 59, 59, 0);
  return [currentMonday, currentSunday];
}

export function sortActivitiesByDate(activities: ActivityResponse[]): ActivityResponse[] {
  const activitiesToSort: ActivityResponse[] = [...activities];
  activitiesToSort.map((activity) => {
    const index = activity.time.indexOf(':');
    const hours = activity.time.substring(0, index);
    const minutes = activity.time.substring(index + 1);
    const date = new Date(activity.date);
    date.setHours(+hours);
    date.setMinutes(+minutes);
    // eslint-disable-next-line no-param-reassign
    activity.date = date.toISOString();
    return activity.date;
  });
  return activitiesToSort.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function countSpeed(time: string, distance: number): string {
  const splittedTime: string[] = time.split(':');
  const [hours, minutes, seconds] = splittedTime;
  const totalTime: number = (+hours * 3600 + +minutes * 60 + +seconds) / 3600;
  return (distance / totalTime).toFixed(1);
}

export function changeDateFormat(dateString: string, time: string): string {
  return `${new Date(dateString).toLocaleString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} at ${time}`;
}
