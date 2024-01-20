import { ProFormRadio, PageContainer, ProForm, ProFormTextArea, ProFormDependency } from '@ant-design/pro-components';
import { getSchedule } from '@/services/api/courseSchedule';
import { getDetails } from '@/services/api/courseOverview';
import { scheduleVerify } from '@/services/api/scheduleVerify';
import { history } from 'umi';
import { useSearchParams } from '@umijs/max';
import { waitTime } from '@/utils/request';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Table, Card, message, Descriptions, Form, Space, Radio } from 'antd';
import type { DescriptionsProps } from 'antd';

interface LabData {
  labId: number;
  labName: string;
  allocMap: Record<string, LabAllocation>;
}

interface LabAllocation {
  id: number;
  labId: number;
  lab: any;
  section: number;
  weekRange: number;
  weekDay: number;
  createdBy: number;
  courseName: string;
}

export default () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const [schedule, setSchedule] = useState<API.CourseScheduleVO>();
  const flag = useRef(false);
  const [labOverview, setLabOverview] = useState<Record<string, LabData>>();
  const [currentSection, setCurrentSection] = useState<number>(schedule?.section?.[0]!);
  const [currentWeekDay, setCurrentWeekDay] = useState<number>(schedule?.weekDay?.[0]!);
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];
  const [selectedLabs, setSelectedLabs] = useState<number[]>([]);
  const reload = useCallback(() => {
    getSchedule({ id: id as any }).then((result) => {
      setSchedule(result);
    });
    getDetails().then((result) => {
      setLabOverview(result);
    });
  }, [id]);

  useEffect(() => {
    waitTime().then(() => {
      reload();
      if (!flag.current) {
        setCurrentSection(schedule?.section?.[0]!);
        setCurrentWeekDay(schedule?.weekDay?.[0]!);
        if(currentSection && currentWeekDay){
          flag.current = true;
        }
      }
    });
  }, [id, schedule]);

  const labList: LabData[] = [];
  if (labOverview && typeof labOverview === 'object') {
    Object.keys(labOverview).forEach(labId => {
      const lab = labOverview[labId];
      let freelab = true;
      Object.keys(lab.allocMap).forEach(key => {
        if (
          schedule?.weekRange?.includes(parseInt(key.split('.')[0], 10)) &&
          schedule?.weekDay?.includes(parseInt(key.split('.')[1], 10)) &&
          schedule?.section?.includes(parseInt(key.split('.')[2], 10))
        ) {
          freelab = false;
        }
      });
      if (freelab){
        Object.keys(lab.allocMap).forEach(key => {
          if (
            (currentWeekDay !== parseInt(key.split('.')[1], 10)) ||
            (currentSection !== parseInt(key.split('.')[2], 10))
          ) {
            delete lab.allocMap[key];
          }
        });
        labList.push(lab);
      }
    });
  };

  const onFinish = async (values: any) => {
    const { reason, status } = values;
    const data: API.ScheduleVerifyDTO = {
      id: schedule?.id,
      reason, status,
      labIds: selectedLabs,
    };
    let result;
    if (schedule) {
      result = await scheduleVerify(data);
    }
    if(typeof(result) !== 'undefined'){
      history.push('/lab/scheduleVerify');
      message.success('保存成功');
      return true;
    }
    return false;
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '上课星期',
      children: schedule?.weekDay?.map(weekDayValue => {
        return `周${chineseNumbers[weekDayValue-1]}`;
      }).join(', '),
    },
    {
      key: '2',
      label: '课节',
      span: 2,
      children: schedule?.section?.map(sectionValue => {
        return `第${chineseNumbers[sectionValue-1]}大节`;
      }).join(', '),
    },
    {
      key: '3',
      label: '上课周',
      span: 3,
      children: schedule?.weekRange?.map(weekRangeValue => {
        return `第${weekRangeValue}周`;
      }).join(', '),
    },
    {
      key: '4',
      label: '学生数量',
      children: schedule?.studentCount,
    },
    {
      key: '5',
      label: '房间数量',
      span: 2,
      children: schedule?.roomCount,
    },
    {
      key: '6',
      label: '学期',
      children: schedule?.seasonName,
    },
    {
      key: '7',
      label: '备注',
      span: 2,
      children: schedule?.description,
    },
  ];

  const handleLabClick = (labId: number) => {
    setSelectedLabs((prevLabIds) => {
      if (prevLabIds.includes(labId)) {
        return prevLabIds.filter((id) => id !== labId);
      }
      if (prevLabIds.length === schedule?.roomCount){
        return [...prevLabIds];
      }
      return [...prevLabIds, labId];
    });
  };

  const labColumns = [
    {
      title: `周${chineseNumbers[currentWeekDay-1]} 第${chineseNumbers[currentSection-1]}大节`,
      dataIndex: 'labName',
      key: 'labName',
      onCell: (record: LabData) => ({
        onClick: () => handleLabClick(record.labId),
        style: {
          backgroundColor: selectedLabs.includes(record.labId) ? 'orange' : 'white',
        },
      }),
    },
    ...[...Array(18).keys()].map((week) => ({
      title: `${week + 1}周`,
      dataIndex: `week${week + 1}`,
      key: `week${week + 1}`,
      render: (_: any, record: LabData) => (
        <div
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: selectedLabs.includes(record.labId) && schedule?.weekRange?.includes(week + 1)
            ? 'orange'
            : Object.keys(record.allocMap).some(key => key.split('.')[0] === `${week + 1}`)
              ? '#757575'
              : '#fff',
          }}
        ></div>
      ),
    })),
  ];
  
    return (
      <PageContainer>
        <Card>
          <Descriptions title={`课程：${schedule?.courseName}`} items={items} />
        </Card>

        <Radio.Group
          style={{
            margin: 16,
          }}
          onChange={(e) => setCurrentWeekDay(e.target.value)}
          value={currentWeekDay}
        >
          {schedule?.weekDay?.map((weekDay) => (
            <Radio key={weekDay} value={weekDay}>
              周{chineseNumbers[weekDay-1]}
            </Radio>
          ))}
        </Radio.Group>
        <Radio.Group
          style={{
            margin: 16,
          }}
          onChange={(e) => setCurrentSection(e.target.value)}
          value={currentSection}
        >
          {schedule?.section?.map((section) => (
            <Radio key={section} value={section}>
              第{chineseNumbers[section-1]}大节
            </Radio>
          ))}
        </Radio.Group>

        <Table
          columns={labColumns}
          dataSource={labList}
          pagination={false}
          bordered
          size="small"
        />

        <div style={{ margin: 24, }} />
        <ProForm 
          onFinish={onFinish}
          submitter={{
            render: (_, dom) => (
              <Form.Item wrapperCol={{ offset: 20 }}>
                  <Space>{dom}</Space>
              </Form.Item>
            ),
          }}>
          <ProFormRadio.Group
            name="status"
            label="结论"
            options={[
              { label: '审核通过', value: 1 },
              { label: '驳回修改', value: 2 },
              { label: '拒绝申请', value: 3 },
            ]}
          />
          <ProFormDependency name={['status']}>
            {({ status }) => {
              if (!status || status === 1) return null;
              return (<ProFormTextArea
                name="reason"
                label="驳回理由"
                rules={[
                  {
                    required: true,
                    message: '请填写驳回理由',
                  },
                ]}
              />);
            }}
          </ProFormDependency>
        </ProForm>
      </PageContainer>
    );
  };