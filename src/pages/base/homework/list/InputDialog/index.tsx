import { listDepartment } from '@/services/api/department';
import { addHomework, updateHomework } from '@/services/api/homework';
import { waitTime } from '@/utils/request';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';

interface InputDialogProps {
  detailData?: API.HomeworkDTO;
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
    try {
      if (props.detailData) {
        await updateHomework({ ...values, id: props.detailData?.id }, { throwError: true });
      } else {
        await addHomework(values, { throwError: true });
      }
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('保存成功');
    return true;
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
      title={props.detailData ? '修改作业信息' : '新建作业'}
      open={props.visible}
    >
      <ProFormText
        name="name"
        label="作业名称"
        rules={[
          {
            required: true,
            message: '请输入作业名称！',
          },
        ]}
      />
      <ProFormSelect
        colProps={{ span: 8 }}
        name="deptIds"
        label="班级"
        fieldProps={{
          mode: 'multiple',
        }}
        request={async () => {
          const pageData = await listDepartment({ pageSize: 100, current: 1 });
          return (pageData?.list || []).map((item) => {
            return { label: item.departmentName, value: item.id };
          });
        }}
        rules={[{ required: true }]}
      />

      <ProFormText
        name="courseName"
        label="课程名称"
        rules={[
          {
            required: true,
            message: '请输入联系人名称！',
          },
        ]}
      />

      <ProFormText name="description" label="备注" />
    </ModalForm>
  );
}
