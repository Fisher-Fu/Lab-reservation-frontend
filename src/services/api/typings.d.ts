declare namespace API {
  type addDepartmentUserParams = {
    departmentId: number;
    userCode: string;
    name: string;
  };

  type AdminDTO = {
    id?: number;
    userCode?: string;
    name?: string;
    sex?: number;
    enabled?: boolean;
    password?: string;
    department?: string;
    phone?: string;
    email?: string;
    adminType?: number;
    modList?: AdminModDTO[];
    labIds?: number[];
  };

  type AdminModDTO = {
    id?: string;
    privList?: string[];
  };

  type AdminVO = {
    id?: number;
    userCode?: string;
    name?: string;
    sex?: number;
    enabled?: boolean;
    password?: string;
    department?: string;
    phone?: string;
    email?: string;
    adminType?: number;
    createdAt?: string;
    createdBy?: number;
    createdByDesc?: string;
    updatedAt?: string;
    updatedBy?: number;
    updatedByDesc?: string;
  };

  type AllocatedScheduleDTO = {
    id?: number;
    labId?: number;
    lab?: Lab;
    section?: number;
    weekRange?: number;
    weekDay?: number;
    createdBy?: number;
    courseName?: string;
  };

  type AllocSchedule = {
    labId?: number;
    labName?: string;
    allocMap?: Record<string, any>;
  };

  type CourseScheduleDTO = {
    id?: number;
    courseName?: string;
    section?: number[];
    weekRange?: number[];
    weekDay?: number[];
    studentCount?: number;
    roomCount?: number;
    description?: string;
  };

  type CourseScheduleQueryDTO = {
    current?: number;
    pageSize?: number;
    courseName?: string;
  };

  type CourseScheduleVO = {
    id?: number;
    courseName?: string;
    section?: number[];
    weekRange?: number[];
    weekDay?: number[];
    studentCount?: number;
    status?: number;
    seasonId?: number;
    seasonName?: string;
    statusDesc?: string;
    description?: string;
    roomCount?: number;
    reason?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    createdByDesc?: string;
    labAddresses?: string[];
    labNames?: string[];
  };

  type CurrentUser = {
    accessToken?: string;
    userCode?: string;
    email?: string;
    phone?: string;
    name?: string;
    browser?: string;
    avatar?: string;
    os?: string;
    device?: string;
    sex?: number;
    department?: string;
    ipAddress?: string;
    lastAction?: string;
    userId?: number;
    adminId?: number;
    privSet?: string[];
    adminType?: number;
  };

  type DeleteDepartmentUserDTO = {
    departmentId?: number;
    ids?: number[];
  };

  type DepartmentDetailVO = {
    id?: number;
    name?: string;
    userList?: UserVO[];
  };

  type DepartmentDTO = {
    id?: number;
    departmentName?: string;
    contact?: string;
    contactPhone?: string;
    description?: string;
  };

  type DepartmentVO = {
    id?: number;
    departmentName?: string;
    contact?: string;
    contactPhone?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    createdByDesc?: string;
  };

  type downloadZipParams = {
    id: number;
  };

  type finishHomeworkParams = {
    id: number;
  };

  type getAdminHomeworkDetailParams = {
    id: number;
  };

  type getAdminParams = {
    id: number;
  };

  type getDepartmentParams = {
    id: number;
  };

  type getHomeworkDetailParams = {
    id: number;
  };

  type getScheduleParams = {
    id: number;
  };

  type getUserParams = {
    id: number;
  };

  type HomeworkDetailVO = {
    id?: number;
    name?: string;
    courseName?: string;
    description?: string;
    userList?: UserHomeworkItem[];
  };

  type HomeworkDTO = {
    id?: number;
    name?: string;
    courseName?: string;
    description?: string;
    deptIds?: number[];
  };

  type HomeworkVO = {
    id?: number;
    name?: string;
    courseName?: string;
    description?: string;
    deptIds?: number[];
    finished?: boolean;
    departmentNames?: string[];
    createdByDesc?: string;
    createdAt?: string;
  };

  type importDepartmentParams = {
    departmentName: string;
    contact: string;
    contactPhone: string;
    description: string;
  };

  type KeywordQueryDTO = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    orderBy?: string;
    createdBy?: number;
  };

  type Lab = {
    id?: number;
    name?: string;
    address?: string;
    description?: string;
    capacity?: number;
    area?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
  };

  type LabDTO = {
    id?: number;
    name?: string;
    address?: string;
    capacity?: number;
    area?: number;
    description?: string;
    adminIds?: number[];
  };

  type LabQueryDTO = {
    current?: number;
    pageSize?: number;
    name?: string;
    address?: string;
  };

  type LabVO = {
    id?: number;
    name?: string;
    address?: string;
    description?: string;
    capacity?: number;
    area?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    createdByDesc?: string;
  };

  type loginParams = {
    userId: string;
    password: string;
  };

  type ModuleVO = {
    id?: string;
    privilegeList?: PrivilegeVO[];
  };

  type PageAdminVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: AdminVO[];
  };

  type PageCourseScheduleVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: CourseScheduleVO[];
  };

  type PageDepartmentVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: DepartmentVO[];
  };

  type PageHomeworkVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: HomeworkVO[];
  };

  type PageLabVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: LabVO[];
  };

  type PageSeasonVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: SeasonVO[];
  };

  type PageUserVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: UserVO[];
  };

  type PrivilegeVO = {
    id?: string;
    description?: string;
  };

  type resetPasswordParams = {
    id: number;
  };

  type ScheduleVerifyDTO = {
    id?: number;
    reason?: string;
    status?: number;
    labIds?: number[];
  };

  type SeasonDTO = {
    id?: number;
    seasonName?: string;
    enabled?: boolean;
    startedAt?: string;
  };

  type SeasonQueryDTO = {
    current?: number;
    pageSize?: number;
    seasonName?: string;
  };

  type SeasonVO = {
    id?: number;
    seasonName?: string;
    startedAt?: string;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    createdByDesc?: string;
  };

  type UpdateSelfDTO = {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    phone?: string;
    email?: string;
  };

  type uploadFileParams = {
    homeworkId: number;
  };

  type UserDTO = {
    id?: number;
    userCode?: string;
    name?: string;
    sex?: number;
    identityNumber?: string;
    email?: string;
    phone?: string;
    expiredAt?: string;
    enabled?: boolean;
    local?: boolean;
    description?: string;
  };

  type UserHomework = {
    id?: number;
    homeworkId?: number;
    sha1?: string;
    fileSize?: number;
    fileName?: string;
    ipAddress?: string;
    createdBy?: number;
    createdAt?: string;
  };

  type UserHomeworkDetailVO = {
    id?: number;
    name?: string;
    courseName?: string;
    files?: UserHomework[];
  };

  type UserHomeworkItem = {
    userId?: number;
    userCode?: string;
    name?: string;
    createdAt?: string;
    files?: UserHomework[];
  };

  type UserQueryDTO = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    roleId?: number;
    expired?: number;
    enabled?: number;
    logined?: number;
    orderBy?: string;
  };

  type UserVO = {
    id?: number;
    userCode?: string;
    name?: string;
    sex?: number;
    identityNumber?: string;
    email?: string;
    phone?: string;
    expiredAt?: string;
    enabled?: boolean;
    local?: boolean;
    description?: string;
    sexDesc?: string;
    roleName?: string;
    lastLoginAt?: string;
    updatedAt?: string;
    updatedBy?: number;
    updatedByDesc?: string;
  };
}
