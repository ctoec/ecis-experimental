export default function argsWithValuesOnly(obj: any){
    const result: any = {};

    for (const key in obj) {
        if(obj[key] !== '') result[key] = obj[key];
    }

    return result;
}