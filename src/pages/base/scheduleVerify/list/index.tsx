import { listCourseSchedule } from '@/services/api/courseSchedule';
import { convertPageData } from '@/utils/request';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { Link } from 'umi';
import { Tag } from 'antd';
import { keyBy } from 'lodash';

export default () => {
  const refAction = useRef<ActionType>(null);
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
      title: '上课人数',
      width: 60,
      search: false,
      dataIndex: 'studentCount',
    },
    {
      title: '需要实验室数量',
      width: 60,
      search: false,
      dataIndex: 'roomCount',
    },
    {
      title: '备注',
      dataIndex: 'description',
      width: 100,
      search: false,  
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
      width: 60,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.CourseScheduleVO) => {
        return <Link to={`/lab/scheduleVerify/verify?id=${record.id}`}>审核</Link>;
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
