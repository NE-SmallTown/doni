# Doni

A high performance UI library using magic Mobx and Antd!

# What magic it has?

See https://zhuanlan.zhihu.com/p/469224590

# Install

`npm i doni`

# Example

```jsx
import { Table, BodyCell, ModalButton, DoniTableColumn } from 'doni';
import { types } from 'mobx-state-tree';

const ModelArticle = types.model({
    id: types.string,
    images: types.array(types.string),
});

const columns: DoniTableColumn<IModelArticle>[] = [
    {
        title: 'id',
        width: '10%',
        fixed: 'left',
        render: (article) => article.id,
    },
    {
        title: 'images',
        width: '15%',
        render: ({ images }) => {
            return (
                <BodyCell className='image-wrap'>
                    <Image src={ images[0] } className='image'/>
                </BodyCell>
            )
        },
    },
    {
        title: 'Action',
        width: '15%',
        fixed: 'right',
        render: (article, { modals: [ changeTitleModal ], action }) => {
            const handleSubmitChangeForm = async (submitData: any) => {
                action.setRecord((article: IModelArticle) => {
                    article.title = submitData.newTitle;
                });

                await new Promise(r => {
                    setTimeout(r, 3000);
                });

                changeTitleModal.closeModal();
            };

            return (
                <BodyCell className='action-wrap'>
                    <ModalButton
                        className='action-change'
                        button='Change'
                        modal={ changeTitleModal }
                        modalProps={{
                            title: 'Change title',
                        }}
                    >
                        <Form
                            layout='horizontal'
                            submitter={{
                                render: (_, dom) => <div className='modal-form-footer'>{ dom }</div>,
                            }}
                            onFinish={ handleSubmitChangeForm }
                        >
                            <Input
                                name='newTitle'
                                label={<div className='modal-label'>New Title</div>}
                                placeholder='Please input new title.'
                                rules={[{ required: true, message: 'Please input new title.' }]}
                            />
                        </ProForm>
                    </ModalButton>
                </BodyCell>
            );
        },
    },
];

<Table
    recordMobxType={ ModelArticle }
    initData={ articles }
    columns={ columns }
    loading={ articles.length === 0 }
    pagination={{ defaultPageSize: 4 }}
/>
```
