import { redirect } from "react-router-dom";
import * as METHODS from "../document"

export async function action({params, request}){
    const formData = await request.formData();
    console.log(formData)
    if(!formData.get("name")){
        METHODS.desletDoc(params.docId)
        return redirect(`/`)
    }else{
        const updates = Object.fromEntries(formData);
        METHODS.updateDoc(params.docId, updates)
        return redirect(`/editor/${params.docId}`)
    }
}