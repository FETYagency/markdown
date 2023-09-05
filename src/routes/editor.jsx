import {Fragment, useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Form, Link, useSubmit } from 'react-router-dom';
import {marked} from 'marked';

import * as METHODS from "../document"
import * as SVG from "../svg"

import { useLoaderData } from 'react-router-dom';

export function load({params}){
    let currDoc = METHODS.getCurrDoc(params.docId)
    return currDoc
}
export async function action({params, request}){
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    METHODS.updateDoc(params.docId, updates)
    return null
}


export default function Editor({created=false}){
    const currDoc = useLoaderData()
    const submit = useSubmit()

    const {content,id,name} = currDoc

    const mdForm = useRef(null)
    const nameForm = useRef(null)
    const destroyForm = useRef(null)
    
    console.log(created)
    const [nameInput, setNameInput] = useState(created)
    const [markdownText, setMarkdownText] = useState(content);
    const [inPreview, setInPreview] = useState(false)
    const [confirm, setConfirm] = useState(false)

    const htmlContent = marked(markdownText);

    const DEL_SVG = SVG.DelSvg()
    const SAVE_SVG = SVG.SaveSvg()
    const PV_SVG = SVG.ShowPvSvg()
    const HPV_SVG = SVG.HidePvSvg()
    const DOC_SVG = SVG.DocSvg()


    function handleSubmit(event){
        submit(mdForm.current)
        console.log(mdForm)
    }
    
    useEffect(()=>{
        if(content.id!==id) setMarkdownText(content)
        if(created) nameForm.current.focus()
    },[content,created])
    return (
        
        <Fragment>
            {
                confirm&&
                (
                    <div className="overlay" onClick={e=>{
                        setConfirm(false)
                    }}>
                        <div className="askToDeleteUI">
                            <h2>Delete comment</h2>
                            <article>
                                <p>Are you sure you want to delete this comment? This will remove the comment and can’t be undone.</p>
                            </article>
                            <button type="button" className='yes' onClick={e=>{
                                submit(destroyForm.current)
                            }}>YES, DELETE</button>
                        </div>
                    </div>  
                )
            }
            <header className='header'>
                <div className="logo">
                    <h1>MARKDOWN</h1>
                </div>
                <div className="doc-name" onClick={e=>{
                    if(!created){
                        flushSync(()=>{
                            setNameInput(!nameInput)
                        })
                        if(nameForm.current) nameForm.current.focus()                    
                    }
                }}>
                    <span className='svg'>{DOC_SVG}</span>
                    <h3 className='label'>Document Name</h3>
                    <span className="name">
                        {
                            nameInput
                            ?(
                                <Form method='post'>
                                    <input ref={nameForm} defaultValue={name} type="text" name='name'/>
                                </Form>
                            )
                            :(
                                <h3 className='name'>{name}</h3>
                            )
                        }
                    </span>
                </div>
                <Form ref={destroyForm} className='hiddenForm' method='post' action={`/editor/${id}/destroy`}></Form>
                <button type='button' className="del-btn" onClick={e=>setConfirm(!confirm)}>{DEL_SVG}</button>
                <button className="save-btn" type='button' onClick={handleSubmit}>{SAVE_SVG} Save Changes</button>
            </header>

            {
                !inPreview
                ?(
                    <Form ref={mdForm} method='post' className="markdown-editor">
                        <div className='markdown'>
                            <div className="bar">
                                <h3>MARKDOWN</h3>
                            </div>
                            <textarea
                                className="markdown-input"
                                value={markdownText}
                                name='content'
                                disabled={created}
                                onChange={(event)=>setMarkdownText(event.target.value)}
                            />
                        </div>
                        <div className="preview">
                            <div className="bar">
                                <h3>PREVIEW</h3>
                                <button onClick={e=>setInPreview(!inPreview)} type='button'>{inPreview?HPV_SVG:PV_SVG}</button>
                            </div>
                            <div
                                className="markdown-preview"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>
                    </Form>
                )
                :(
                    <div className="preview">
                        <div className="bar">
                            <h3>PREVIEW</h3>
                            <button onClick={e=>setInPreview(!inPreview)} type='button'>{inPreview?HPV_SVG:PV_SVG}</button>
                        </div>
                        <div
                            className="markdown-preview"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                )
            }


        </Fragment>
    )
}