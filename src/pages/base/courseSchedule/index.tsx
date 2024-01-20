import { deleteCourseSchedule, listCourseSchedule, cancelCourseSchedule} from '@/services/api/courseSchedule';
import { convertPageData } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { DeleteRowOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { keyBy } from 'lodash';
import { useRef, useState } from 'react';
import InputDialog from '../courseSchedule/InputDialog';

export default () => {
  const [visible, setVisible] = useState(false);
  const refAction = useRef<ActionType>(null);
  const [courseSchedule, setCourseSchedule] = useState<API.CourseScheduleVO>();
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];

  const STATUS_OPTION = [
    { text: '待审核', value: 0, color: '' },
    { text: '通过', value: 1, color: 'green' },
    { text: '待修改', value: 2, color: 'orange' },
    { text: '被拒绝', value: 3, color: 'red' },
    { text: '已撤销', value: 4, color: 'brown' },
  ]
  const StatusEnum = keyBy(STATUS_OPTION, 'value')

  const handleDelete = (ids: number[]) => {
    if (!ids || ids.length === 0) {
      return;
    }
    openConfirm(`您确定要删除选定的${ids.length}个申请吗？`, async () => {
      const result = await deleteCourseSchedule(ids);
      if (typeof result !== 'undefined') {
        message.success(`成功的删除了${result}个申请！`);
      }
      if (result) {
        refAction.current?.clearSelected!();
        refAction.current?.reload();
      }
    });
  };

  const cancel = async (record: API.CourseScheduleVO) => {
    record.status = 4;
    let result;
    result = await cancelCourseSchedule(record);
    if(typeof(result) !== 'undefined'){
      message.success('撤销成功');
      refAction.current?.reload();
      return true;
    }
    return false;
  }

  const columns: ProColumns<API.CourseScheduleVO>[] = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 100,
    },
    {
      title: '上课星期',
      width: 100,
      search: false,
      dataIndex: 'weekDay',
      render: (_, record) => record.weekDay?.map(dayNumber => `周${chineseNumbers[dayNumber-1]}`).join(','),
    },
    {
      title: '课节',
      width: 100,
      search: false,
      dataIndex: 'section',
      render: (_, record) => record.section?.map(sectionNumber => `第${chineseNumbers[sectionNumber-1]}大节`).join(','),
    },
    {
      title: '上课周',
      width: 100,
      search: false,
      dataIndex: 'weekRange',
      render: (_, record) => record.weekRange?.map(weekRangeNumber => `第${weekRangeNumber}周`).join(','),
    },
    {
      title: '学期',
      dataIndex: 'seasonName',
      width: 50,
      search: false,
    },
    {
      title: '驳回理由',
      dataIndex: 'reason',
      width: 100,
      search: false,
    },
    {
      title: '分配的实验室',
      dataIndex: 'labNames',
      width: 100,
      search: false,
      render: (_, record) => record.labNames?.join(','),
    },
    {
      title: '实验室地点',
      dataIndex: 'labAddresses',
      width: 100,
      search: false,
      render: (_, record) => record.labAddresses?.join(','),
    },
    {
      title: '状态',
      width: 60,
      search: false,
      fixed: 'right',
      dataIndex: 'status',
      valueType: 'select',    
      valueEnum: StatusEnum,
      fieldProps: { mode: 'multiple' },
      render: (text, { status }) => {
          const tagStatus = StatusEnum[status!] || { color: '', text: '状态信息错误或缺失！' };
          return <Tag color={tagStatus.color}>{tagStatus.text}</Tag>;
      },
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.CourseScheduleVO) => {
        if(record.status === 2){
          return [
            <a
              key="modify"
              onClick={() => {
                setCourseSchedule(record);
                setVisible(true);
              }}
            >
              修改
            </a>,
            <a
              key="cancel"
              onClick={() => {
                cancel(record);
              }}
            >
              撤销
            </a>,
            <a
              key="delete"
              onClick={() => {
                handleDelete([record.id!]);
              }}
            >
              删除
            </a>,
          ]
        } else {
          return [
            <a
              key="detail"
              onClick={() => {
                setCourseSchedule(record);
                setVisible(true);
              }}
            >
              详情
            </a>,
            <a
              key="cancel"
              onClick={() => {
                cancel(record);
              }}
            >
              撤销
            </a>,
            <a
              key="delete"
              onClick={() => {
                handleDelete([record.id!]);
              }}
            >
              删除
            </a>,
          ]
        }
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.CourseScheduleVO>
        actionRef={refAction}
        rowKey="id"
        scroll={{ x: 100 }}
        search={{
          labelWidth: 120,
        }}
        request={async (params = {}) => {
          return convertPageData(await listCourseSchedule(params));
        }}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCourseSchedule(undefined);
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
        detailData={courseSchedule}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
