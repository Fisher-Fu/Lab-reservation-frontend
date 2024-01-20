// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/lab/addLab */
export async function addLab(body: API.LabDTO, options?: { [key: string]: any }) {
  return request<number>('/api/lab/addLab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/lab/deleteLab */
export async function deleteLab(body: number[], options?: { [key: string]: any }) {
  return request<number>('/api/lab/deleteLab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/lab/listLab */
export async function listLab(body: API.LabQueryDTO, options?: { [key: string]: any }) {
  return request<API.PageLabVO>('/api/lab/listLab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/lab/updateLab */
export async function updateLab(body: API.LabDTO, options?: { [key: string]: any }) {
  return request<number>('/api/lab/updateLab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
