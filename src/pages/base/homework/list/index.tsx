import { deleteHomework, finishHomework, listHomework } from '@/services/api/homework';
import { convertPageData } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [homework, setHomework] = useState<API.HomeworkDTO>();
  const [visible, setVisible] = useState(false);
  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      const cnt = await deleteHomework(selectedRowKeys);
      if (cnt) {
        refAction.current?.reload();
      }
      if (typeof cnt !== 'undefined') {
        message.success(`您成功的删除了${cnt}条记录`);
      }
    });
  };

  const handleFinish = async (id: number) => {
    openConfirm(`您确定结束该作业吗？作业结束之后，学生将无法上传作业`, async () => {
      await finishHomework({ id });
      refAction.current?.reload();
    });
  };
  const columns: ProColumns<API.HomeworkVO>[] = [
    {
      title: '作业号',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '班级',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => record.departmentNames?.join(','),
    },
    {
      title: '作业名称',
      dataIndex: 'courseName',
      width: 150,
      ellipsis: true,
      render: (dom, record) => {
        return <Link to={`/base/homework/student?id=${record.id}`}>{record.name}</Link>;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 150,
      ellipsis: true,
      search: false,
    },

    {
      title: '创建人',
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
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        !record.finished && (
          <a
            key="modify"
            onClick={() => {
              setHomework(record);
              setVisible(true);
            }}
          >
            修改
          </a>
        ),
        !record.finished && (
          <a
            key="end"
            onClick={() => {
              handleFinish(record.id!);
            }}
          >
            结束
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.DepartmentVO>
        actionRef={refAction}
        rowKey="id"
        request={async (params = {}) => {
          return convertPageData(await listHomework(params));
        }}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setHomework(undefined);
              setVisible(true);
            }}
          >
            <PlusOutlined /> 新建
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
        visible={visible}
        detailData={homework}
        onClose={(result) => {
          setVisible(false);
          result && refAction?.current?.reload();
        }}
      />
    </PageContainer>
  );
};
