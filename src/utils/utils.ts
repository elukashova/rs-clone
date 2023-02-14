import { FriendData } from '../app/loader/loader.types';

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
