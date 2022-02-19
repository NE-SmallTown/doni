import { observer } from 'mobx-react-lite';
import React, {useCallback} from 'react';
import { Pagination } from 'antd';
import { useModel } from './Context';
import { DoniTablePaginationProps } from './types';

import './DoniTablePagination.css'

interface Props<RecordType> {
    pagination?: DoniTablePaginationProps;
}

const DoniTablePagination = observer(function DoniTablePagination<RecordType>(props: Props<RecordType>) {
    const { pagination } = props;

    const { currentPage, list, setCurrentPage } = useModel();

    const paginationProps = {
        ...pagination,
        current: currentPage,
        total: list.length,
    };

    const handlePageChange = useCallback((page, pageSize) => {
        setCurrentPage(page, pageSize);
    }, []);

    return (
        <div className='doni-table-pagination'>
            {/* @ts-ignore */}
            <Pagination onChange={ handlePageChange } { ...paginationProps } />
        </div>
    );
});

export default DoniTablePagination;
