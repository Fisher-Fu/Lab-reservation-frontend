import { getAdminHomeworkDetail } from '@/services/api/homework';
import { formatValue } from '@/utils/string-utils';
import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputDialog from '../../user/InputDialog';

export default () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [homeworkData, setHomeworkData] = useState<API.HomeworkDetailVO>();
  const [userId, setUserId] = useState<number | undefined>();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [params, setParams] = useState<any>();
  const reload = useCallback(() => {
    getAdminHomeworkDetail({ id: id as any }).then((result) => {
      setHomeworkData(result);
    });
  }, [id]);
  useEffect(() => {
    reload();
  }, [id]);

  const list = homeworkData?.userList?.filter((item) => {
    if (params?.name && item.name!.indexOf(params.name) < 0) {
      return false;
    }
    if (params?.userCode && item.userCode!.indexOf(params.userCode) < 0) {
      return false;
    }
    return true;
  });

  list?.sort((o1, o2) => o2.files?.length! - o1.files?.length!);
  const submitUserCount = list?.filter((o) => o.files?.length)?.length || 0;

  const columns: ProColumns<API.UserHomeworkItem>[] = [
    {
      title: '序号',
      width: 80,
      search: false,
      render: (_, __, index) => `${index + 1}`,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      fixed: true,
      ellipsis: true,
      render: (_: any, record) => {
        return (
          <a
            onClick={() => {
              setUserId(record.userId);
              setVisible(true);
            }}
          >
            {record.name}
          </a>
        );
      },
    },
    {
      title: '学号',
      dataIndex: 'userCode',
      width: 150,
    },
    {
      title: '文件数',
      width: 80,
      search: false,
      render: (_, record) => `${record.files?.length || 0}个`,
    },
    {
      title: '大小',
      width: 100,
      search: false,
      render: (_, record) => {
        let size = 0;
        record.files?.forEach((item) => (size += item.fileSize!));
        return formatValue(size);
      },
    },
    {
      title: '提交时间',
      search: false,
      dataIndex: 'createdAt',
      width: 120,
    },
  ];

  const expandedRowRender = useCallback((record: API.UserHomeworkItem) => {
    return record?.files?.map((item, index) => (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <span style={{ padding: '5px' }}>{index + 1}.</span>
        <span style={{ padding: '5px', fontWeight: 'bold' }}>文件名：</span>
        <span style={{ padding: '5px' }}>{item.fileName}</span>
        <span style={{ padding: '5px', fontWeight: 'bold' }}>大小：</span>
        <span style={{ padding: '5px' }}>{formatValue(item.fileSize!)}</span>
        <span style={{ padding: '5px', fontWeight: 'bold' }}>IP地址：</span>
        <span style={{ padding: '5px' }}>{item.ipAddress}</span>
        <span style={{ padding: '5px', fontWeight: 'bold' }}>提交时间：</span>
        <span style={{ padding: '5px' }}>{item.createdAt}</span>
      </div>
    ));
  }, []);

  return (
    <PageContainer
      extra={`共${homeworkData?.userList?.length || 0}个学生，${submitUserCount}个提交了作业`}
      header={{
        title: `作业提交情况 - ${homeworkData?.courseName || ''} - ${homeworkData?.name || ''}`,
      }}
    >
      <ProTable<API.UserHomeworkItem>
        actionRef={refAction}
        rowKey="userCode"
        manualRequest
        dataSource={list || []}
        tableAlertRender={false}
        expandable={{ expandedRowRender }}
        onSubmit={(params) => {
          console.log(params);
          setParams(params);
          reload();
        }}
        toolBarRender={() => [
          <Button
            disabled={!submitUserCount}
            type="primary"
            key="primary"
            href={'/api/homework/downloadZip?id=' + id}
          >
            <DownloadOutlined /> 打包下载
          </Button>,
        ]}
        options={{
          reload,
        }}
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />
      <InputDialog
        id={userId}
        onClose={(result) => {
          setVisible(false);
          result && reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
