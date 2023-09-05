import { useRef, useState } from "react";
import { Form, Link, Outlet, redirect, useLoaderData } from "react-router-dom";
import * as METHODS from "../document"

import { dataProvider } from "../context";  

import * as SVG from "../svg"

export function load({params}){
    let DOX = METHODS.getDoc_s()
    if(!params.docId) return redirect(`editor/${DOX[DOX.length-1].id}`)
    return DOX
}
export function action(){
    let ID_ = METHODS.createDoc()
    return redirect(`editor/${ID_}/edit`)
}

export default function Root(){
    const DOX = useLoaderData()

    const DEL_SVG = SVG.CloseSvg()
    const MENU_SVG = SVG.MenuSvg()
    const DOC_SVG = SVG.DocSvg()


    let [navState, setNavState] = useState(false)
    
    return(
        <dataProvider.Provider value={DOX}>
            <main className="main-ui">
                <div className={"documents-links" + (navState?" showen":"")}>
                    <h2 className="label">MY DOCUMENTS</h2>
                    <Form method="post">
                        <button className="create-btn">+ New Document</button>
                    </Form>
                    <nav className="links">
                        {DOX.length>0
                        ?
                        (
                            DOX.map(per=>{
                                return <Link to={`editor/${per.id}`}>
                                    <span className="doc-svg">{DOC_SVG}</span>
                                    <h3 className="label">{per.createdAt}</h3>
                                    <h3 className="name">{per.name}</h3>
                                    
                                </Link>
                            })
                        )
                        :<p>No Document</p>
                        }
                    </nav>
                    <div className="theme-switcher">
                    </div>
                </div>
                <button className="nav-btn" onClick={e=>setNavState(!navState)}>{navState?DEL_SVG:MENU_SVG}</button>
                <Outlet/>
            </main>
        </dataProvider.Provider>
    ) 
}