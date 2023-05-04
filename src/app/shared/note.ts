export interface Note{
    content: string;
    user: string;
    title: string;
    timestampCreated:string;
    timestampUpdated?:string;
    id?:string;
    color?:string;
    left?:number;
    top?:number;
    zIndex:number;
    pref?:boolean;
}