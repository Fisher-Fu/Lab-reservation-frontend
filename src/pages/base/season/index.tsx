/**
 * 名称：学期信息维护模块
 * 作者：何一凡
 * 单位：山东大学
 * 上次修改：2023-10-25
 */
import { deleteSeason, listSeason } from '@/services/api/season';
import { openConfirm } from '@/utils/ui';
import { convertPageData } from '@/utils/request';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [season, setSeason] = useState<API.SeasonVO>();
  //visible:页面变量,控制对话框显示状态
  const [visible, setVisible] = useState(false);

  const columns: ProColumns<API.SeasonVO>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 20,
      search: false,
    },
    {
      title: '学期',
      dataIndex: 'seasonName',
      width: 50,
      render: (dom: any, record: API.SeasonVO) => {
        return (
          <a
            onClick={() => {
              setSeason(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '学期起始日期',
      dataIndex: 'startedAt',
      width: 100,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 50,
      search: false,
      render: (_: any, record) => {
        return record?.enabled ? '启用' : '禁用';
      },
    },
  ];

  //删除操作
  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteSeason(selectedRowKeys);
      refAction.current?.reload();
    });
  };
  return (
    /*弹窗 */
    <PageContainer>
      <ProTable<API.SeasonVO>
        actionRef={refAction}
        rowKey="id"
        //request: 配置了一个用于获取实验室数据列表的请求函数
        request={async (params = {}) => {
            // 通过listSeason方法获得的后端数据, 利用convertPageData函数把或得到的数据转换为页面需要的数据格式
            return convertPageData(await listSeason(params));
          }}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setSeason(undefined);
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
        // 引入InputDialog组件, 用于新建
        detailData={season}
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