/**
 * 名称：实验室信息维护模块
 * 作者：何一凡
 * 单位：山东大学
 * 上次修改：2023-10-25
 */
import { deleteLab, listLab } from '@/services/api/lab';
import { openConfirm } from '@/utils/ui';
import { convertPageData } from '@/utils/request';
import { DeleteRowOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [lab, setLab] = useState<API.LabVO>();
  //visible:页面变量,控制对话框显示状态
  const [visible, setVisible] = useState(false); 

  const handleDelete = (ids: number[]) => {
    if (!ids || ids.length === 0) {
      return;
    }

    openConfirm(`您确定要删除选定的${ids.length}个实验室吗？`, async () => {
      const result = await deleteLab(ids);
      if (typeof result !== 'undefined') {
        message.success(`成功的删除了${result}个实验室！`);
      }
      if (result) {
        refAction.current?.clearSelected!();
        refAction.current?.reload();
      }
    });
  };

  const columns: ProColumns<API.LabVO>[] = [
    {
      title: '实验室序号',
      dataIndex: 'id',
      width: 20,
      search: false,
    },
    {
      title: '实验室名称',
      dataIndex: 'name',
      width: 50,
      render: (dom: any, record: API.LabVO) => {
        return (
          <a
            onClick={() => {
              setLab(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 50,
    },
    {
      title: '最大容纳人数',
      dataIndex: 'capacity',
      width: 50,
      search: false,
    },
    {
      title: '面积',
      dataIndex: 'area',
      width: 50,
      search: false,
    },
    {
      title: '设施描述',
      dataIndex: 'description',
      width: 100,
      search: false,  
    },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.CourseScheduleVO) => [
        <a
          key="delete"
          onClick={() => {
            handleDelete([record.id!]);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    /*弹窗 */
    <PageContainer>
      <ProTable<API.LabVO>
        actionRef={refAction}
        rowKey="id"
        //request: 配置了一个用于获取实验室数据列表的请求函数
        request={async (params = {}) => {
            // 通过listLab方法获得的后端数据, 利用convertPageData函数把或得到的数据转换为页面需要的数据格式
            return convertPageData(await listLab(params));
          }}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setLab(undefined);
              setVisible(true);
            }}
          >
            <PlusOutlined /> 新建
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
        //引入InputDialog组件,用于新建
        detailData={lab}
        onClose={(result) => {
          setVisible(false);
          // 在成功新建数据后触发刷新
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
