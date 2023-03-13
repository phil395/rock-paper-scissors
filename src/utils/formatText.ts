const colorMap = {
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
} as const;

export interface IFormatTextOptions {
  color?: keyof typeof colorMap;
  bold?: boolean;
}

export type FormatText = typeof formatText;

export const formatText = (
  text: string,
  options: IFormatTextOptions
): string => {
  const color = options.color ? colorMap[options.color] : "";
  const bold = options.bold ? "1" : "";
  const value = color && bold ? `${color};${bold}` : color || bold;
  return `\x1b[${value}m${text}\x1b[0m`;
};
