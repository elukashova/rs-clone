export function getClassNames(baseName: string, addName: string | undefined): string {
  return addName ? `${baseName} ${addName}` : baseName;
}

export function convertRegexToPattern(regex: RegExp): string {
  return regex.toString().slice(1, -1);
}
