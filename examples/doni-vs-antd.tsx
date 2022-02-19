import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Tabs, Button, Table as AntdTable, Image, Form as AntdForm, Input as AntdInputO } from 'antd';
import { Instance, types } from 'mobx-state-tree';
import { ColumnsType as AntdColumn } from 'antd/es/table';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import Table, { DoniTableColumn as TableColumn, CopyToClipboard, Ellipsis, BodyCell, ModalButton } from 'doni'
import Form, { Input, CheckBox } from 'doni/esm/form';

function AntdInput(props: any) {
    console.log(`AntdInput（${props.id}） render`);

    return <AntdInputO { ...props } />
}

const { TabPane } = Tabs;

const ModelArticle = types.model({
    id: types.string,
    title: types.string,
    url: types.string,
    likeCount: types.number,
    createAt: types.string,
    images: types.array(types.string),
});

interface IModelArticle extends Instance<typeof ModelArticle> {}

const tabs = [ 'tab1', 'tab2', 'tab3' ];

const columns: TableColumn<IModelArticle>[] = [
    {
        title: 'id',
        width: '10%',
        fixed: 'left',
        render: (article) => (
            <BodyCell className='id-wrap'>
                <span className='text-id'>{ article.id }</span>

                <CopyToClipboard text={ article.id } />
            </BodyCell>
        ),
    },
    {
        title: 'title',
        width: '10%',
        render: (article) => (
            <BodyCell>
                <Ellipsis className='title-wrap'>
                    { article.title }
                </Ellipsis>

                <CopyToClipboard text={ article.title } />
            </BodyCell>
        ),
    },
    {
        title: 'date',
        width: '10%',
        render: (article) => article.createAt,
    },
    {
        title: 'likes',
        width: 100,
        render: (article) => article.likeCount,
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
        render: (article, { modals: [ changeTitleModal ], action}) => {
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
                        <ProForm
                            layout='horizontal'
                            submitter={{
                                render: (_, dom) => <div className='modal-form-footer'>{ dom }</div>,
                            }}
                            onFinish={ handleSubmitChangeForm }
                        >
                            <ProFormText
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

const genRandomArticle = () => ({
    id: Math.random().toString(36).slice(2),
    title: Math.random().toString(36).slice(2),
    url: `https://www.${Math.random().toString(36).slice(2)}.com`,
    likeCount: Math.round(Math.random() * 100000),
    createAt: `2022-02-${(10 + Math.random() * 20).toFixed(0)}`,
    images: ['https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'],
});

const getArticles = async (tab: string) => {
    await new Promise(r => { setTimeout(r, 1000) });

    return Array.from({ length: Math.round(8 + Math.random() * 10) }).map(genRandomArticle);
};

function DoniTableDemo() {
    const [ tab, setTab ] = useState(tabs[0]);
    const [ articlesByTab, setArticlesByTab ] = useState<any>({});

    const handleSwitchTab = useCallback((tab) => {
        setTab(tab);
    }, []);

    useEffect(() => {
        if (!articlesByTab[tab]) {
            getArticles(tab).then((articles: any) => {
                setArticlesByTab((articlesByTab: any) => ({
                    ...articlesByTab,
                    [tab]: articles,
                }));
            });
        }
    }, [ tab ]);

    return (
        <div className='demo-root'>
            <h3 className='title'>Doni Table Demo</h3>

            <Tabs activeKey={ tab } onChange={ handleSwitchTab } size='large'>
                {
                    tabs.map(tab => (
                        <TabPane tab={ tab } key={ tab }>
                            <Table<IModelArticle>
                                className='article-table'
                                recordMobxType={ ModelArticle }
                                initData={ articlesByTab[tab] }
                                columns={ columns }
                                loading={ !articlesByTab[tab] }
                                pagination={{ defaultPageSize: 4 }}
                            />
                        </TabPane>
                    ))
                }
            </Tabs>
        </div>
    );
}

function AntdTableDemo() {
    const [ tab, setTab ] = useState(tabs[0]);
    const [ articlesByTab, setArticlesByTab ] = useState<any>({});
    const pagination = useMemo(() => ({ pageSize: 4 }), []);

    const handleSwitchTab = useCallback((tab) => {
        setTab(tab);
    }, []);

    const columns: AntdColumn<IModelArticle> = useMemo(() => [
        {
            title: 'id',
            width: '10%',
            fixed: 'left',
            render: (_, article) => (
                <div className='id-wrap'>
                    <span className='text-id'>{ article.id }</span>

                    <CopyToClipboard text={ article.id } />
                </div>
            ),
        },
        {
            title: 'title',
            width: '10%',
            render: (_, article) => (
                <div>
                    <Ellipsis className='title-wrap'>
                        { article.title }
                    </Ellipsis>

                    <CopyToClipboard text={ article.title } />
                </div>
            ),
        },
        {
            title: 'date',
            width: '10%',
            render: (_, article) => article.createAt,
        },
        {
            title: 'likes',
            width: 100,
            render: (_, article) => article.likeCount,
        },
        {
            title: 'images',
            width: '15%',
            render: (_, { images }) => {
                return (
                    <div className='image-wrap'>
                        <Image src={ images[0] } className='image'/>
                    </div>
                )
            },
        },
        {
            title: 'Action',
            width: '15%',
            fixed: 'right',
            render: (_, article) => {
                const handleSubmitChangeForm = async (submitData: any) => {
                    setArticlesByTab((articlesByTab: any) => ({
                        ...articlesByTab,
                        [tab]: articlesByTab[tab].map((item: IModelArticle) => {
                            if (item.id === article.id) {
                                return {
                                    ...item,
                                    title: submitData.newTitle,
                                };
                            }

                            return item;
                        }),
                    }));

                    await new Promise(r => {
                        setTimeout(r, 3000);
                    });

                    return true;
                };

                return (
                    <div className='action-wrap'>
                        <ModalForm
                            className='action-change'
                            title='Change title'
                            trigger={
                                <Button type="primary">
                                    Change title
                                </Button>
                            }
                            onFinish={ handleSubmitChangeForm }
                        >
                            <ProFormText
                                name='newTitle'
                                label={<div className='modal-label'>New Title</div>}
                                placeholder='Please input new title.'
                                rules={[{ required: true, message: 'Please input new title.' }]}
                            />
                        </ModalForm>
                    </div>
                );
            },
        },
    ], [ tab ]);

    useEffect(() => {
        if (!articlesByTab[tab]) {
            getArticles(tab).then((articles: any) => {
                setArticlesByTab((articlesByTab: any) => ({
                    ...articlesByTab,
                    [tab]: articles,
                }));
            });
        }
    }, [ tab ]);

    return (
        <div className='demo-root'>
            <h3 className='title'>Antd Table Demo</h3>

            <Tabs activeKey={ tab } onChange={ handleSwitchTab } size='large'>
                {
                    tabs.map(tab => (
                        <TabPane tab={ tab } key={ tab }>
                            <AntdTable<IModelArticle>
                                rowKey='id'
                                className='article-table'
                                dataSource={ articlesByTab[tab] }
                                columns={ columns }
                                loading={ !articlesByTab[tab] }
                                pagination={ pagination }
                            />
                        </TabPane>
                    ))
                }
            </Tabs>
        </div>
    );
}

function DoniFormDemo() {

    return (
        <div className='demo-root'>
            <h3 className='title'>Doni Form Demo</h3>

            <Form onFinish={submitData => { console.log('Doni Form Demo', submitData) }}>
                <Form.FormItem
                    name='level'
                    label={ form => form.level === 'P8' ? '建议回炉' : '职级' }
                >
                    <Input />
                </Form.FormItem>

                <Form.FormItem
                    name='money'
                    label={ form => form.level === 'P8' ? '325 就是你了。' : '年终奖' }
                >
                    <Input
                        disabled={ form => form.level === 'P9' }
                        placeholder={ form => form.level === 'P9' ? 'P9 啦，请喜茶啦，要什么✈️!': '请输入年终奖' }
                    />
                </Form.FormItem>

                <Button type="primary" htmlType='submit'>
                    Submit
                </Button>
            </Form>

            <h3 className='title' style={{ marginTop: '100px' }}>Antd Form Demo</h3>

            <AntdForm onFinish={submitData => { console.log('Antd Form Demo', submitData) }}>
                <AntdForm.Item name='level' label='职级'>
                    <AntdInput />
                </AntdForm.Item>

                <AntdForm.Item noStyle dependencies={['level']}>
                    {({ getFieldValue }) => (
                        <AntdForm.Item
                            name='money'
                            label={ getFieldValue('level') === 'P8' ? '325 就是你了。' : '年终奖' }
                        >
                            <AntdInput
                                disabled={ getFieldValue('level') === 'P9' }
                                placeholder={ getFieldValue('level') === 'P9' ? 'P9 啦，请喜茶啦，要什么✈️!': '请输入年终奖' }
                            />
                        </AntdForm.Item>
                    )}
                </AntdForm.Item>

                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
            </AntdForm>
        </div>
    );
}

export default function Page() {

    return (
        <div>
            <DoniTableDemo />

            <AntdTableDemo />

            <DoniFormDemo />
        </div>
    );
}
