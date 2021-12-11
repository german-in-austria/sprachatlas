import { TagOrteResults } from "../static/apiModels";

export const computePropCircle = (data: Array<number>, maxRadius: number): number => {
  const radiusOfData: Array<number> = [];
  let max = 0
  for (const d of data) {
    if(d > max) max = d;
  }
  return maxRadius / max;
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

export const drawCircleDiagram = (size: number, border: number, borderColor: string, color: string, data: [{v: number, c: string}], encoded: boolean) => {
    let hSize = size * 0.5
    let ihSize = (size - border * 2) * 0.5
    let out = ''
    out += '<circle cx="' + hSize + '" cy="' + hSize + '" r="' + hSize + '" fill="' + borderColor + '" />'
    out += '<circle cx="' + hSize + '" cy="' + hSize + '" r="' + ihSize + '" fill="' + color + '" />'
    let max: number = data.flat(Infinity).reduce((a: any, b: any) => Number(a) + (Number(b.v) || 0), 0)
    let angMulti = 360 / max
    let lAng = 0
    data.forEach((el: any) => {
        let nAng = lAng + el.v * angMulti;
        out += '<path d="' + describeArc(hSize, hSize, ihSize, lAng, nAng) + '" stroke-width="0" fill="' + (el.c || '#f00') + '" />'
        lAng = nAng
    })
    out = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + out + '</svg>'
    return encoded ? 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(out))) : out
}

export const drawRect = (size: number, border: number, color: string, encoded: boolean, opacity: number) => {
  const hSize = size * 1.7;
  let out = '';
  out += `<rect x="0" y="0" width="${size}" height="${hSize}" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-opacity="0.8" stroke-width="${border}"/>`
  out = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="' + size + '" height="' + hSize + '" viewBox="0 0 ' + size + ' ' + hSize + '">' + out + '</svg>'
  return encoded ? 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(out))) : out
}

export const drawTriangle = (size: number, border: number, color: string, encoded: boolean, opacity: number) => {
  let out = '';
  out += `<polygon points="${size/2},0 ${size},${size} 0,${size}" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-opacity="0.8" stroke-width="${border / 10}"/>`
  out = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + out + '</svg>'
  return encoded ? 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(out))) : out
}