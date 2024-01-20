// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/season/addSeason */
export async function addSeason(body: API.SeasonDTO, options?: { [key: string]: any }) {
  return request<number>('/api/season/addSeason', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/season/deleteSeason */
export async function deleteSeason(body: number[], options?: { [key: string]: any }) {
  return request<any>('/api/season/deleteSeason', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/season/listSeason */
export async function listSeason(body: API.SeasonQueryDTO, options?: { [key: string]: any }) {
  return request<API.PageSeasonVO>('/api/season/listSeason', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/season/updateSeason */
export async function updateSeason(body: API.SeasonDTO, options?: { [key: string]: any }) {
  return request<number>('/api/season/updateSeason', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
