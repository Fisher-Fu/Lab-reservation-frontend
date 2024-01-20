// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/courseOverview/listDetails */
export async function getDetails(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/courseOverview/listDetails', {
    method: 'POST',
    ...(options || {}),
  });
}
