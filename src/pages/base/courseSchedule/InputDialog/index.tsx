import { ModalForm, ProForm, ProFormInstance, ProFormText, ProFormTextArea, ProFormSelect, ProFormDigit, } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { waitTime } from '@/utils/request';
import { addCourseSchedule, updateCourseSchedule } from '@/services/api/courseSchedule';

interface InputDialogProps {
  detailData?: API.CourseScheduleVO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);
  const [weekRange, setWeekRange] = useState<number[]>(props.detailData?.weekRange || []);
  const isAtLeastOneSelected = weekRange.length > 0;
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
        setWeekRange(props.detailData.weekRange || []);
      } else {
        form?.current?.resetFields();
        setWeekRange([]);
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async (values: any) => {
    const { courseName, section, weekDay, studentCount, roomCount, description, } = values;
    const data: API.CourseScheduleDTO = {
      id: props.detailData?.id,
      courseName, section, weekRange, weekDay, studentCount, roomCount, description,
    };
    let result;
    if (props.detailData) {
      result = await updateCourseSchedule(data);
    } else {
      result = await addCourseSchedule(data);
    }
    if(typeof(result) !== 'undefined'){
      props.onClose(true);
      message.success('保存成功');
      return true;
    }
    return false;
  };

  const handleWeekClick = (week : any) => {
    const updatedWeekRange = weekRange.includes(week)
      ? weekRange.filter((weekRange) => weekRange !== week)
      : [...weekRange, week];
  
    setWeekRange(updatedWeekRange);
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.detailData ? '修改申请信息' : '新建申请'}
      open={props.visible}
    >
      <ProFormText
        name="courseName"
        label="课程名称"
        fieldProps={{
          style: { width: '500px' },
        }}
        rules={[
          {
            required: true,
            message: '请提供课程名称',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormSelect
          name="section"
          label="课节"
          fieldProps={{
            mode: 'multiple',
            style: { width: '500px' },
          }}
          request={async () => {
            const numberOfSections = 5;
            return Array.from({ length: numberOfSections }, (_, index) => {
              return { label: `第${chineseNumbers[index]}大节`, value: index + 1 };
            });
          }}
          rules={[
            {
              required: true,
              message: '请提供课节',
            },
          ]}
        />

        <ProFormSelect
          name="weekDay"
          label="上课星期"
          fieldProps={{
            mode: 'multiple',
            style: { width: '500px' },
          }}
          request={async () => {
            const numberOfWeekDays = 7;
            return Array.from({ length: numberOfWeekDays }, (_, index) => {
              return { label: `周${chineseNumbers[index]}`, value: index + 1 };
            });
          }}
          rules={[
            {
              required: true,
              message: '请提供上课星期',
            },
          ]}
        />
      </ProForm.Group>

      <div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: 'red' }}>*</span> 
          <span style={{ color: 'black' }}> 上课周</span>
        </div>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              {[...Array(16).keys()].map((week) => (
                <td
                  key={week + 1}
                  style={{
                    width: '50px',
                    height: '30px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: weekRange.includes(week + 1) ? '#1890ff' : 'transparent',
                    color: weekRange.includes(week + 1) ? '#fff' : '#333',
                  }}
                  onClick={() => handleWeekClick(week + 1)}
                >
                  {week + 1}周
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {isAtLeastOneSelected ? null : (
          <div style={{ color: 'red', marginTop: '5px' }}>
            请至少选择一个上课周
          </div>
        )}
        <div style={{ marginBottom: '30px' }}></div>
      </div>

      <ProForm.Group>
        <ProFormDigit
          name="studentCount"
          label="学生数量"
          fieldProps={{
            style: { width: '200px' },
          }}
          rules={[
            {
              required: true,
              message: '请提供学生数量',
            },
            {
              type: 'number',
              min: 1,
              max: 300,
              message: '请输入有效的学生数量',
            },
          ]}
        />

        <ProFormDigit
          name="roomCount"
          label="房间数量"
          fieldProps={{
            style: { width: '200px' },
          }}
          rules={[
            {
              required: true,
              message: '请提供房间数量',
            },
            {
              type: 'number',
              min: 1,
              max: 10,
              message: '请输入有效的房间数量',
            },
          ]}
        />
      </ProForm.Group>

      <ProFormTextArea name="description" label="备注" />
    </ModalForm>
  );
}