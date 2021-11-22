export const getOrtName = (name: string) => {
    if(name !== null){
        const reg = /^([\w\sa-zA-Z\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\u00df]*),\s(\w*)/;
        const res = reg.exec(name);
        if(res){
            return res.length > 2 ? {name: res[1], bl: res[2]} : res.length === 2 ? {name: res[1]} : {name: res[0]};
        }
    }
    return {name};
}

export const generateID = () => {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}