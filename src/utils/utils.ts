import { FriendData } from '../app/loader/loader-responses.types';

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
