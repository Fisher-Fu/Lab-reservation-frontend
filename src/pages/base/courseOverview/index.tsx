import { PageContainer } from '@ant-design/pro-components';
import { getDetails } from '@/services/api/courseOverview';
import { waitTime } from '@/utils/request';
import { useCallback, useEffect, useState } from 'react';
import { Table, Radio } from 'antd';

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
  const [labOverview, setLabOverview] = useState<Record<string, LabData>>();
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentWeekDay, setCurrentWeekDay] = useState<number>(1);
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];
  const reload = useCallback(() => {
    getDetails().then((result) => {
      setLabOverview(result);
    });
  }, []);

  useEffect(() => {
    waitTime().then(() => {
      reload();
    });
  }, [currentSection, currentWeekDay]);

  const labList: LabData[] = [];
  if (labOverview && typeof labOverview === 'object') {
    Object.keys(labOverview).forEach(labId => {
      const lab = labOverview[labId];
      Object.keys(lab.allocMap).forEach(key => {
        if (
          (currentWeekDay !== parseInt(key.split('.')[1], 10)) ||
          (currentSection !== parseInt(key.split('.')[2], 10))
        ) {
          delete lab.allocMap[key];
        }
      });
      labList.push(lab);
    });
  };

  const labColumns = [
    {
      title: `周${chineseNumbers[currentWeekDay-1]} 第${chineseNumbers[currentSection-1]}大节`,
      dataIndex: 'labName',
      key: 'labName',
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
            backgroundColor: Object.keys(record.allocMap).some(key => key.split('.')[0] === `${week + 1}`) ? '#757575' : '#fff',
          }}
        ></div>
      ),
    })),
  ];
  
    return (
      <PageContainer>
        <Radio.Group
          style={{
            margin: 16,
          }}
          onChange={(e) => setCurrentWeekDay(e.target.value)}
          value={currentWeekDay}
        >
          {[1,2,3,4,5,6,7].map((weekDay) => (
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
          {[1,2,3,4,5].map((section) => (
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
      </PageContainer>
    );
  };