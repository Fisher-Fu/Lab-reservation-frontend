import { deleteDepartmentUser, getDepartment } from '@/services/api/department';
import { openConfirm } from '@/utils/ui';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputDialog from '../../user/InputDialog';
import AddDialog from './AddDialog';

export default () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [department, setDepartment] = useState<API.DepartmentDetailVO>();
  const [userId, setUserId] = useState<number | undefined>();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [params, setParams] = useState<any>();
  const reload = useCallback(() => {
    getDepartment({ id: id as any }).then((result) => {
      setDepartment(result);
    });
  }, [id]);
  useEffect(() => {
    reload();
  }, [id]);

  const list = department?.userList?.filter((item) => {
    if (params?.name && item.name!.indexOf(params.name) < 0) {
      return false;
    }
    if (params?.userCode && item.userCode!.indexOf(params.userCode) < 0) {
      return false;
    }
    return true;
  });

  list?.sort((o1, o2) => o1.userCode!.localeCompare(o2.userCode!));

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: '学号',
      dataIndex: 'userCode',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      fixed: true,
      width: 150,
      ellipsis: true,
      render: (_: any, record: API.UserVO) => {
        return (
          <a
            onClick={() => {
              setUserId(record.id);
              setVisible(true);
            }}
          >
            {record.name}
          </a>
        );
      },
    },
    {
      title: '过期日期',
      search: false,
      dataIndex: 'expiredAt',
      width: 80,
    },
    {
      title: '状态',
      search: false,
      dataIndex: 'enabled',
      render: (_: any, record: API.UserVO) => (record.enabled ? '正常' : '禁用'),

      width: 60,
    },
    {
      title: '上次登录',
      search: false,
      dataIndex: 'lastLoginAt',

      width: 60,
    },
  ];

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteDepartmentUser({ departmentId: id as any, ids: selectedRowKeys });
      reload();
    });
  };

  return (
    <PageContainer
      extra={`共${department?.userList?.length || 0}个学生`}
      header={{
        title: `班级学生 - ${department?.name || ''}`,
      }}
    >
      <ProTable<API.UserVO>
        actionRef={refAction}
        rowKey="id"
        manualRequest
        dataSource={list || []}
        tableAlertRender={false}
        onSubmit={(params) => setParams(params)}
        options={{
          reload,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setAddVisible(true);
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
        id={userId}
        onClose={(result) => {
          setVisible(false);
          result && reload();
        }}
        visible={visible}
      />
      <AddDialog
        departmentId={department?.id!}
        onClose={(result) => {
          setAddVisible(false);
          result && reload();
        }}
        visible={addVisible}
      />
    </PageContainer>
  );
};
