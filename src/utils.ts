const colorMap = {
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
} as const;

interface FormatOptions {
  color?: keyof typeof colorMap;
  bold?: boolean;
}

export const formatText = (text: string, options: FormatOptions): string => {
  const color = options.color ? colorMap[options.color] : "";
  const bold = options.bold ? "1" : "";
  const value = color && bold ? `${color};${bold}` : color || bold;
  return `\x1b[${value}m${text}\x1b[0m`;
};
