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