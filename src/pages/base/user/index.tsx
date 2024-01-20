/**
 * 名称：管理员维护模块
 * 作者：李洪文
 * 单位：山东大学
 * 上次修改：2023-3-3
 */
import { deleteUser, listUser, resetPassword } from '@/services/api/user';
import { convertPageData } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { DeleteRowOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, message } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';

export default () => {
  const [visible, setVisible] = useState(false);
  const refAction = useRef<ActionType>(null);
  const [userId, setUserId] = useState<number | undefined>();
  const [selectedRowKeys, selectRow] = useState<number[]>([]);

  const handleDelete = (ids: number[]) => {
    if (!ids || ids.length === 0) {
      return;
    }

    openConfirm(`您确定要删除选定的${ids.length}个用户吗？`, async () => {
      const result = await deleteUser(ids);
      if (typeof result !== 'undefined') {
        message.success(`成功的删除了${result}个用户！`);
      }
      if (result) {
        refAction.current?.clearSelected!();
        refAction.current?.reload();
      }
    });
  };

  const handleResetPassword = (id: number) => {
    if (!id) {
      return;
    }

    openConfirm(`您确定重置选定用户的登录密码吗？`, async () => {
      const result = await resetPassword({ id });
      if (result) {
        message.success(`成功的重置了用户密码！`);
        refAction.current?.clearSelected!();
      }
    });
  };

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      fixed: true,
      width: 80,
      ellipsis: true,
      search: false,
      render: (dom: any, record: API.UserVO) => {
        return (
          <a
            onClick={() => {
              setUserId(record.id);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },

    {
      title: '学号',
      width: 100,
      ellipsis: true,
      search: false,
      dataIndex: 'userCode',
    },
    {
      title: '性别',
      width: 60,
      search: false,
      dataIndex: 'sexDesc',
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

      width: 80,
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.UserVO) => [
        <a
          key="modify"
          onClick={() => {
            setUserId(record.id);
            setVisible(true);
          }}
        >
          修改
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleDelete([record.id!]);
          }}
        >
          删除
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleResetPassword(record.id!);
          }}
        >
          重置密码
        </a>,
      ],
    },
    {
      title: '关键词',
      key: 'keyword',
      hideInTable: true,
      //@ts-ignore
      renderFormItem: (_: any, { type }) => {
        if (type === 'form') {
          return null;
        }
        return <Input allowClear placeholder="姓名/单位/电话/备注等" />;
      },
    },
    {
      title: '登录情况',
      width: 80,
      hideInTable: true,
      key: 'logined',
      valueType: 'select',
      initialValue: undefined,
      valueEnum: {
        1: {
          text: '未登录过',
        },
        2: {
          text: '登录过',
        },
      },
    },
    {
      title: '过期情况',
      width: 80,
      hideInTable: true,
      key: 'expired',
      valueType: 'select',
      initialValue: undefined,
      valueEnum: {
        1: {
          text: '未过期',
        },
        2: {
          text: '已过期',
        },
      },
    },
    {
      title: '禁用情况',
      width: 80,
      hideInTable: true,
      key: 'enabled',
      valueType: 'select',
      initialValue: undefined,
      valueEnum: {
        1: {
          text: '未禁用',
        },
        2: {
          text: '已禁用',
        },
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.AdminVO>
        actionRef={refAction}
        rowKey="id"
        scroll={{ x: 100 }}
        search={{
          labelWidth: 120,
        }}
        request={async (params = {}) => {
          return convertPageData(await listUser(params));
        }}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setUserId(undefined);
              setVisible(true);
            }}
          >
            新建
          </Button>,
          <Button
            type="default"
            key="delete"
            disabled={!selectedRowKeys?.length}
            icon={<DeleteRowOutlined />}
            danger
            onClick={() => {
              handleDelete(selectedRowKeys);
            }}
          >
            删除
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
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
