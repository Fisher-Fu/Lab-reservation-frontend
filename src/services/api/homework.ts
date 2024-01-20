// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/homework/addHomework */
export async function addHomework(body: API.HomeworkDTO, options?: { [key: string]: any }) {
  return request<number>('/api/homework/addHomework', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/homework/deleteHomework */
export async function deleteHomework(body: number[], options?: { [key: string]: any }) {
  return request<number>('/api/homework/deleteHomework', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/homework/downloadZip */
export async function downloadZip(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.downloadZipParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/homework/downloadZip', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/homework/finishHomework */
export async function finishHomework(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.finishHomeworkParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/homework/finishHomework', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/homework/getAdminHomeworkDetail */
export async function getAdminHomeworkDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminHomeworkDetailParams,
  options?: { [key: string]: any },
) {
  return request<API.HomeworkDetailVO>('/api/homework/getAdminHomeworkDetail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/homework/listHomework */
export async function listHomework(body: API.KeywordQueryDTO, options?: { [key: string]: any }) {
  return request<API.PageHomeworkVO>('/api/homework/listHomework', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/homework/updateHomework */
export async function updateHomework(body: API.HomeworkDTO, options?: { [key: string]: any }) {
  return request<number>('/api/homework/updateHomework', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
