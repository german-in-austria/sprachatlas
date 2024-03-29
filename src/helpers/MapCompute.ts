import { TagOrteResults } from '../static/apiModels';

export const computePropCircle = (
  data: Array<number>,
  maxRadius: number
): number => {
  const radiusOfData: Array<number> = [];
  let max = 0;
  for (const d of data) {
    if (d > max) max = d;
  }
  return maxRadius / max;
};

export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
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
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
    'L',
    x,
    y,
    'L',
    start.x,
    start.y
  ].join(' ');
  return d;
};

export const drawCircleDiagram = (
  size: number,
  border: number,
  borderColor: string,
  color: string,
  data: [{ v: number; c: string; id: string }],
  encoded: boolean,
  padding: number = 1,
  background: boolean = true,
  pathBorder: boolean = false
) => {
  const viewport = size * padding;
  const hSize = size * 0.5 * padding;
  const ihSize = (size - border * 2) * 0.5;
  let out = '';
  //out += '<defs>';
  if (background) {
    out +=
      '<circle cx="' +
      hSize +
      '" cy="' +
      hSize +
      '" r="' +
      hSize +
      '" fill="' +
      borderColor +
      '" />';
    out += `<circle class="hover" id="${data[0].id}" cx="${hSize}" cy="${hSize}" r="${ihSize}" fill="${color}" />`;
  }
  /**/
  const max: number = data
    .flat(Infinity)
    .reduce((a: any, b: any) => Number(a) + (Number(b.v) || 0), 0);
  const angMulti = 360 / max;
  let lAng = 0;
  data.forEach((el: any) => {
    const nAng = lAng + el.v * angMulti;
    //out += `<filter id="${el.id}">`;
    /*
    out +=
      '<path class="hover" d="' +
      describeArc(hSize, hSize, ihSize, lAng, nAng) +
      '" stroke-width="0" fill="' +
      (el.c || '#f00') +
      '" id="' +
      el.id +
      '"/>';*/
    console.log;
    out += `<path class="hover" 
    d="${describeArc(hSize, hSize, ihSize, lAng, nAng)}"
    stroke-width="${pathBorder ? 1 : 0}" fill="${el.c || '#f00'}" id="${
      el.id
    }" stroke="${pathBorder ? 'black' : 'none'}"/>`;
    //out += `</filter>`;
    lAng = nAng;
  });
  //out += '</defs>';
  out =
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="graph" width="' +
    viewport +
    '" height="' +
    viewport +
    '" viewBox="0 0 ' +
    viewport +
    ' ' +
    viewport +
    '">' +
    out +
    '</svg>';
  return encoded
    ? 'data:image/svg+xml;base64,' +
        window.btoa(unescape(encodeURIComponent(out)))
    : out;
};

export const drawCircle = (
  size: number,
  border: number,
  color: string,
  encoded: boolean,
  opacity: number
) => {
  let circle = `<circle cx="50%" cy="50%" r="${
    size / 2
  }" stroke-width="${border}" fill="${color}" stroke="#000" opacity="${opacity}"/>`;
  circle = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="${size}" height="${size}" viewbox="0 0 ${size} ${size}">${circle}
    </svg>
    `;
  return encoded
    ? 'data:image/svg+xml;base64,' +
        window.btoa(unescape(encodeURIComponent(circle)))
    : circle;
};

export const drawRect = (
  size: number,
  border: number,
  color: string,
  encoded: boolean,
  opacity: number
) => {
  const hSize = size * 1.7;
  let out = '';
  out += `<rect x="0" y="0" width="${size}" height="${hSize}" fill="${color}" fill-opacity="${opacity}" stroke="#000" stroke-opacity="0.8" stroke-width="${
    border / 10
  }"/>`;
  out =
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="' +
    size +
    '" height="' +
    hSize +
    '" viewBox="0 0 ' +
    size +
    ' ' +
    hSize +
    '">' +
    out +
    '</svg>';
  return encoded
    ? 'data:image/svg+xml;base64,' +
        window.btoa(unescape(encodeURIComponent(out)))
    : out;
};

export const drawTriangle = (
  size: number,
  border: number,
  color: string,
  encoded: boolean,
  opacity: number
) => {
  let out = '';
  out += `<polygon points="${
    size / 2
  },0 ${size},${size} 0,${size}" fill="${color}" fill-opacity="${opacity}" stroke="#000" stroke-opacity="0.8" stroke-width="${
    border / 10
  }"/>`;
  out =
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 ' +
    size +
    ' ' +
    size +
    '">' +
    out +
    '</svg>';
  return encoded
    ? 'data:image/svg+xml;base64,' +
        window.btoa(unescape(encodeURIComponent(out)))
    : out;
};
