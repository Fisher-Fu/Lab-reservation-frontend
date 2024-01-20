// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/userHomework/deleteFiles */
export async function deleteFiles(body: number[], options?: { [key: string]: any }) {
  return request<number>('/api/userHomework/deleteFiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/userHomework/getHomeworkDetail */
export async function getHomeworkDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHomeworkDetailParams,
  options?: { [key: string]: any },
) {
  return request<API.UserHomeworkDetailVO>('/api/userHomework/getHomeworkDetail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/userHomework/listHomework */
export async function listUserHomework(options?: { [key: string]: any }) {
  return request<API.HomeworkVO[]>('/api/userHomework/listHomework', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/userHomework/uploadFile */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadFileParams,
  body: {},
  options?: { [key: string]: any },
) {
  return request<number>('/api/userHomework/uploadFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
