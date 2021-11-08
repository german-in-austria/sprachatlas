export const getOrtName = (name: string) => {
    if(name !== null){
        const reg = /^(\w*),\s(\w*)/;
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