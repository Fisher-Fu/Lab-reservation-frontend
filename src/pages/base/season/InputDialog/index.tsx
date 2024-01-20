//新建
import { ModalForm, ProForm, ProFormInstance, ProFormText, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addSeason, updateSeason } from '@/services/api/season';

interface InputDialogProps {
  detailData?: API.SeasonVO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async (values: any) => {
    const { seasonName, enabled, startedAt } = values;
    const data: API.SeasonDTO = {
      id: props.detailData?.id,
      seasonName,
      enabled,
      startedAt,
    };
    let result;
    if (props.detailData) {
      result = await updateSeason(data);
    } else {
      result = await addSeason(data);
    }
    if (result !== undefined) {
      props.onClose(true);
      message.success('保存成功');
      return true;
    } else {
      return false;
    }
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
      title={props.detailData ? '修改学期信息' : '创建新学期'}
      open={props.visible}
    >
      <ProFormText
        name="seasonName"
        label="学期名称"
        rules={[
          {
            required: true,
            message: '请为创建的学期命名',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormDatePicker
          name="startedAt"
          label="学期起始日期"
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProFormSelect
        name="enabled"
        width="xs"
        label="状态"
        valueEnum={{
          true: '启用',
          false: '禁用',
        }}
      />
    </ModalForm>
  );
}
