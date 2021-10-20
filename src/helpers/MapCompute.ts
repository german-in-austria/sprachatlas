export const computePropCircle = (data: Array<number>): Array<number> => {
  const radiusOfData: Array<number> = [];
  let sum = 0;
  for (const d of data) {
    sum += d;
    let divFactor = Math.sqrt(d / Math.PI);
    radiusOfData.push(divFactor);
  }
  return radiusOfData;
};

export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

export const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "L",
    start.x,
    start.y
  ].join(" ");
  return d;
};

export const drawCircleDiagram = (size: number, border: number, borderColor: string, color: string, data: any, encoded: boolean) => {
    let hSize = size * 0.5
    let ihSize = (size - border * 2) * 0.5
    let out = ''
    out += '<circle cx="' + hSize + '" cy="' + hSize + '" r="' + hSize + '" fill="' + borderColor + '" />'
    out += '<circle cx="' + hSize + '" cy="' + hSize + '" r="' + ihSize + '" fill="' + color + '" />'
    let max = data.reduce((a: any, b: any) => a + (b.v || 0), 0)
    let angMulti = 360 / max
    let lAng = 0
    data.forEach((el: any) => {
        let nAng = lAng + el.v * angMulti
        out += '<path d="' + describeArc(hSize, hSize, ihSize, lAng, nAng) + '" stroke-width="0" fill="' + (el.c || '#f00') + '" />'
        lAng = nAng
    })
    out = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + out + '</svg>'
    return encoded ? 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(out))) : out
}