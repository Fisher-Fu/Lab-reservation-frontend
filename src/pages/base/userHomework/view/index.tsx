import { deleteFiles, getHomeworkDetail } from '@/services/api/userHomework';
import { formatValue } from '@/utils/string-utils';
import { openConfirm, prettyDateTime } from '@/utils/ui';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputDialog from './InputDialog';

export default () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [detail, setDetail] = useState<API.UserHomeworkDetailVO>();
  const [visible, setVisible] = useState(false);
  const reload = useCallback(() => {
    getHomeworkDetail({ id: id as any }).then((result) => {
      setDetail(result);
    });
  }, [id]);
  useEffect(() => {
    reload();
  }, [id]);

  const columns: ProColumns<API.UserHomework>[] = [
    {
      title: '序号',
      width: 60,
      search: false,
      render: (_, __, index) => `${index + 1}`,
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'userCode',
      width: 150,
      render: (_, record) => formatValue(record.fileSize!),
    },
    {
      title: '上传时间',
      search: false,
      dataIndex: 'createdAt',
      width: 120,
      render: (_, record) => prettyDateTime(record.createdAt),
    },
  ];

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteFiles(selectedRowKeys);
      reload();
    });
  };

  return (
    <PageContainer
      extra={`共${detail?.files?.length || 0}个文件`}
      header={{
        title: `作业详情 - ${detail?.courseName} - ${detail?.name}`,
      }}
    >
      <ProTable<API.UserHomework>
        actionRef={refAction}
        rowKey="id"
        manualRequest
        tableAlertRender={false}
        search={false}
        dataSource={detail?.files || []}
        options={{
          reload,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            <PlusOutlined /> 新加
          </Button>,
          <Button
            type="primary"
            key="primary"
            danger
            onClick={handleDelete}
            disabled={!selectedRowKeys?.length}
          >
            <DeleteOutlined /> 删除
          </Button>,
        ]}
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />
      <InputDialog
        id={id as any}
        onClose={(result) => {
          setVisible(false);
          result && reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
