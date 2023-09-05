import docs from "./data.json"
import {v4 as uuidv4} from "uuid"


export function _localStorage_(action, data, initialData){
    if(!localStorage.getItem("DB")||!localStorage.getItem("DB").length===0)localStorage.setItem("DB", JSON.stringify(initialData))
    switch (action) {
        case "GET":
            localStorage.setItem("DB", JSON.stringify(data))
            break;
        case "SET":
            return JSON.parse(localStorage.getItem("DB"))
    }
}
let _DB_S = (e)=>_localStorage_("GET", e)
let _DB_G = ()=>_localStorage_("SET")
_localStorage_(undefined, null, docs)


function DOC(name="untitled-document.md", createdAt, content=""){
    this.id = uuidv4()
    this.name = name
    this.createdAt=createdAt
    this.content=content
}

export function getDoc_s(){
    let DB = _DB_G();
    return DB
}
export function getCurrDoc(doc){
    let DB = _DB_G();
    let currDoc = DB.find(ele=>ele.id==doc);
    return currDoc
}

export function updateDoc(docId, updates){
    let docs =_DB_G().map(per=>{
        if(per.id==docId){
            return{
                ...per,
                ...updates
            }
        }else{
            return per
        }
    })
    _DB_S(docs)
}

export function createDoc(name){
    let createdAt = (new Date()).toLocaleDateString().replaceAll("/","-")
    const newDoc = new DOC(name, createdAt)
    let docs = [
        ..._DB_G(),
        newDoc
    ]
    _DB_S(docs)
    return newDoc.id
}

export function desletDoc(docId){
    let docs= _DB_G().filter(per=>{
        return per.id!=docId
    })
    _DB_S(docs)
}