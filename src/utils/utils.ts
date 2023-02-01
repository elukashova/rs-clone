export default function getClassNames(baseName: string, addName: string | undefined): string {
  return addName ? `${baseName} ${addName}` : baseName;
}
