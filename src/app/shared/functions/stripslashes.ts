export function Stripslashes(str?: string): string | null {
  if (str === undefined || str === null) {
    return null;
  }
  return (str + '')
    .replace(/\\(.?)/g, function (s, n1) {
      switch (n1) {
        case '\\':
          return '\\'
        case '0':
          return '\u0000'
        case '':
          return ''
        default:
          return n1
      }
    });
}
