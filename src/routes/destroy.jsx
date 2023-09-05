import { redirect } from "react-router-dom"
import * as METHODS from "../document"

export function action({params}){
    METHODS.desletDoc(params.docId)
    return redirect("/")
}