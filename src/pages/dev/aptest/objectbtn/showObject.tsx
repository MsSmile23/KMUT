import ObjectCardContainer from "@containers/objects/ObjectCardContainer/ObjectCardContainer";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { Modal, ModalProps } from "antd";
import { FC } from "react";
import { redirect, useNavigate } from "react-router-dom"

const Nav = () => {
    const nav = useNavigate()

    return null
}

export const showObject = ({ event, id, modal = {}, modalka }:{
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    modalka?: any
    modal?: ModalProps
}) => {
    if (event.ctrlKey) {
        redirect(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}`)

        return
    }

    Modal.info({
        ...modal,
        icon: null,
        open: true,
        footer: (<div onClick={() => Modal.destroyAll()}>close</div>),
        //content: <ObjectCardContainer id={id} />,
        content: <Nav />,
        maskClosable: true,
        style: {
            height: 300,
            overflowY: 'auto'
        }
    })
}