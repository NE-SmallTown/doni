import React, {ReactElement, PropsWithChildren, useCallback, useState} from 'react';
import { Modal, Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { ITableModal } from './types';

type ModalButtonProps = PropsWithChildren<{
    button: string | ReactElement;
    className?: string;
    modal: ITableModal;
    modalProps?: { [key: string]: any };
}>

const ModalButton = observer(function ModalButton<RecordType>(props: ModalButtonProps) {
    const { button, children, className, modal, modalProps } = props;

    const [ confirmLoading, setConfirmLoading ] = useState(false);

    const handleClickButton = useCallback(() => {
        modal.openModal();
    }, []);

    const handleClickModalOk = useCallback(() => {
        setConfirmLoading(true);
    }, []);

    const handleClickModalCancel = useCallback(() => {
        modal.closeModal();
    }, []);

    return (
        <>
            <Button
                type='primary'
                className={ className }
                onClick={ handleClickButton }
            >
                { button }
            </Button>

            <Modal
                visible={ modal.visible }
                width='50%'
                style={{
                    top: 150,
                }}
                footer={ null }
                destroyOnClose={ true }
                onOk={ handleClickModalOk }
                onCancel={ handleClickModalCancel }
                confirmLoading={ confirmLoading }
                { ...modalProps }
            >
                { children }
            </Modal>
        </>
    );
});

export default ModalButton;