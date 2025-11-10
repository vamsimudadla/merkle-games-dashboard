// Terminal color utilities
const colors = {
  // Basic colors
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Foreground colors
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m'
  },

  // Background colors
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
    brightRed: '\x1b[101m',
    brightGreen: '\x1b[102m',
    brightYellow: '\x1b[103m',
    brightBlue: '\x1b[104m',
    brightMagenta: '\x1b[105m',
    brightCyan: '\x1b[106m',
    brightWhite: '\x1b[107m'
  }
};

// Helper functions for common styling
const colorize = {
  success: (text) => `${colors.fg.brightGreen}${text}${colors.reset}`,
  info: (text) => `${colors.fg.brightCyan}${text}${colors.reset}`,
  warning: (text) => `${colors.fg.brightYellow}${text}${colors.reset}`,
  error: (text) => `${colors.fg.brightRed}${text}${colors.reset}`,
  bold: (text) => `${colors.bright}${text}${colors.reset}`,
  underline: (text) => `${colors.underscore}${text}${colors.reset}`,
  dim: (text) => `${colors.dim}${text}${colors.reset}`,

  // Server-specific colors
  server: (text) => `${colors.fg.brightMagenta}${colors.bright}${text}${colors.reset}`,
  url: (text) => `${colors.fg.brightBlue}${colors.underscore}${text}${colors.reset}`,
  port: (text) => `${colors.fg.brightYellow}${colors.bright}${text}${colors.reset}`,
  endpoint: (text) => `${colors.fg.brightCyan}${text}${colors.reset}`,

  // Custom gradient-like effect
  rainbow: (text) => {
    const rainbowColors = [
      colors.fg.brightRed,
      colors.fg.brightYellow,
      colors.fg.brightGreen,
      colors.fg.brightCyan,
      colors.fg.brightBlue,
      colors.fg.brightMagenta
    ];
    return text.split('').map((char, i) =>
      `${rainbowColors[i % rainbowColors.length]}${char}`
    ).join('') + colors.reset;
  }
};

// Box drawing characters for fancy borders
const box = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  cross: '┼',
  teeUp: '┴',
  teeDown: '┬',
  teeLeft: '┤',
  teeRight: '├'
};

// Create a fancy box around text
const createBox = (lines, title = '') => {
  const maxLength = Math.max(...lines.map(line => line.replace(/\x1b\[[0-9;]*m/g, '').length));
  const width = Math.max(maxLength + 4, title.length + 4);

  let result = '';

  // Top border with title
  if (title) {
    const titlePadding = Math.floor((width - title.length - 2) / 2);
    const titleLine = `${box.horizontal.repeat(titlePadding)} ${colorize.bold(title)} ${box.horizontal.repeat(width - titlePadding - title.length - 3)}`;
    result += `${colors.fg.brightCyan}${box.topLeft}${titleLine}${box.topRight}${colors.reset}\n`;
  } else {
    result += `${colors.fg.brightCyan}${box.topLeft}${box.horizontal.repeat(width)}${box.topRight}${colors.reset}\n`;
  }

  // Content lines
  lines.forEach(line => {
    const plainText = line.replace(/\x1b\[[0-9;]*m/g, '');
    const padding = width - plainText.length - 2;
    result += `${colors.fg.brightCyan}${box.vertical}${colors.reset} ${line}${' '.repeat(padding)} ${colors.fg.brightCyan}${box.vertical}${colors.reset}\n`;
  });

  // Bottom border
  result += `${colors.fg.brightCyan}${box.bottomLeft}${box.horizontal.repeat(width)}${box.bottomRight}${colors.reset}`;

  return result;
};

module.exports = {
  colors,
  colorize,
  box,
  createBox
};