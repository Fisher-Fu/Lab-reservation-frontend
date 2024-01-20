import { deleteDepartment, listDepartment } from '@/services/api/department';
import { convertPageData } from '@/utils/request';
import { openConfirm, prettyDateTime } from '@/utils/ui';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import ImportDialog from './ImportDialog';
import ModifyDialog from './ModifyDialog';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [department, setDepartment] = useState<API.DepartmentVO>();
  const [visible, setVisible] = useState(false);
  const [modiVisible, setModiVisible] = useState(false);
  const columns: ProColumns<API.DepartmentVO>[] = [
    {
      title: '班级ID',
      dataIndex: 'id',
      width: 100,
      search: false,
    },
    {
      title: '班级名称',
      dataIndex: 'keyword',
      width: 150,
      render: (dom, record) => {
        return <Link to={`/base/department/student?id=${record.id}`}>{record.departmentName}</Link>;
      },
    },
    {
      title: '课代表',
      dataIndex: 'contact',
      width: 100,
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'contactPhone',
      width: 100,
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
      render: (_, record) => prettyDateTime(record.createdAt),
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="modify"
          onClick={() => {
            setDepartment(record);
            setModiVisible(true);
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteDepartment(selectedRowKeys);
      refAction.current?.reload();
    });
  };

  return (
    <PageContainer>
      <ProTable<API.DepartmentVO>
        actionRef={refAction}
        rowKey="id"
        request={async (params = {}) => {
          return convertPageData(await listDepartment(params));
        }}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setDepartment(undefined);
              setVisible(true);
            }}
          >
            <PlusOutlined /> 导入
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
      <ImportDialog
        id={1}
        onClose={(result) => {
          if (result) {
            refAction.current?.reload();
          }
          setVisible(false);
        }}
        visible={visible}
      />
      <ModifyDialog
        detailData={department}
        visible={modiVisible}
        onClose={() => setModiVisible(false)}
      />
    </PageContainer>
  );
};
