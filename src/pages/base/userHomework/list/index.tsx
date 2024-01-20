import { listUserHomework } from '@/services/api/userHomework';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { useCallback, useEffect, useRef, useState } from 'react';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [homeworkList, setHomeworkList] = useState<API.HomeworkVO[]>();
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>();
  const [params, setParams] = useState<any>();
  const reload = useCallback(() => {
    listUserHomework().then((result) => {
      setHomeworkList(result);
    });
  }, []);
  useEffect(() => {
    reload();
  }, []);
  const list = homeworkList;
  const columns: ProColumns<API.HomeworkVO>[] = [
    {
      title: '作业号',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '作业名称',
      dataIndex: 'courseName',
      search: false,
      width: 150,
      ellipsis: true,
      render: (dom, record) => {
        return <Link to={`/userHomework/view?id=${record.id}`}>{record.name}</Link>;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'finished',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => `${record.finished ? '已提交' : '未提交'}`,
    },
    {
      title: '教师',
      dataIndex: 'createdByDesc',
      width: 100,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.DepartmentVO>
        actionRef={refAction}
        rowKey="id"
        manualRequest
        dataSource={list || []}
        options={{
          reload,
        }}
        search={false}
        onSubmit={(params) => setParams(params)}
        tableAlertRender={false}
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />
    </PageContainer>
  );
};
