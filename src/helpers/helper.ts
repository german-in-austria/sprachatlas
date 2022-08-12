let colorid = 0;

export const getOrtName = (name: string) => {
  if (name !== null) {
    const reg =
      /^([\w\sa-zA-Z\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\u00df]*),\s(\w*)/;
    const res = reg.exec(name);
    if (res) {
      return res.length > 2
        ? { name: res[1], bl: res[2] }
        : res.length === 2
        ? { name: res[1] }
        : { name: res[0] };
    }
  }
  return { name };
};

export const convertHslToStr = (a: number, s: number, l: number) => {
  return `hsl(${a},${s * 100}%,${l * 100}%)`;
};

export const convertHexToHsl = (str: string) => {
  let r = parseInt(str.substring(1, 3), 16);
  let g = parseInt(str.substring(3, 5), 16);
  let b = parseInt(str.substring(5), 16);

  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = (max + min) / 2;
  let s: number = h;
  const l: number = h;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

export const generateID = () => {
  return (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase();
};

export const selectColor = (num: number | null) => {
  let angle = 0;
  if (num !== null) {
    angle = num * 137.508; // use golden angle approximation
  } else {
    angle = colorid++ * 137.508;
  }
  //return `hsl(${angle},100%,75%)`;
  return {
    h: angle,
    s: 1,
    l: 0.75,
    a: 1
  };
};

/*
 * Returns true if the aufgabe is standard, false if dialect
 */
export const isAufgabeStandard = (val: string): boolean => {
  return val.search('(UED|SPTD)') > -1;
};
