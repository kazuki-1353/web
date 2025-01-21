export const decimal2hex = (decimal: number): string => decimal.toString(16);
export const hex2decimal = (hex: string): number => parseInt(hex, 16);

export const decimal2binary = (decimal: number): string => decimal.toString(2);
export const binary2decimal = (binary: string): number => parseInt(binary, 2);
