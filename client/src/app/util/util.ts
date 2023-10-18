export function getCookie(key: string) {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

export function currencyFormat(amount: number) {
  return "$" + (amount / 100).toFixed(2);
}

export function get_random_color() {
  var color = "";
  for (var i = 0; i < 3; i++) {
    var sub = Math.floor(Math.random() * 256).toString(16);
    color += sub.length === 1 ? "0" + sub : sub;
  }
  return "#" + color;
}

export function invertHex(hex: string) {
  return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
}
