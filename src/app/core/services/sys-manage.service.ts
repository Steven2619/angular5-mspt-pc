import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {HttpService} from './http.service';

@Injectable()
export class SysManageService {

  private  baseURL = environment.apiBase;

  constructor(
    public dialog: MatDialog,
    private httpServ: HttpService
  ) { }

  /**
   * 用户管理
   * 查询用户信息
   * @param queryInfo
   * @returns {Observable<any>}
   */
  getUserInfoList(pageInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/getList', pageInfo);
    return resultInfo;
  }

  /**
   * 用户管理
   * 添加用户信息
   * @param info
   * @returns {Observable<any>}
   */
  addUserInfo(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/addUser', info);
    return resultInfo;
  }

  /**
   * 用户管理
   * 删除用户信息
   * @param id
   * @returns {Observable<any>}
   */
  deleteUserInfo(id): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/delete', {id: id});
    return resultInfo;
  }

  /**
   * 用户管理
   * 修改用户信息
   * @param info
   * @returns {Observable<any>}
   */
  modifyUserInfo(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/updateUser', info);
    return resultInfo;
  }
  /**
   * 用户管理
   * 修改用户密码
   * @param info
   * @returns {Observable<any>}
   */
  updateUserPassword(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/updateUserPassword', info);
    return resultInfo;
  }
  /**
   * 用户管理
   * 重置用户密码
   * @param info
   * @returns {Observable<any>}
   */
  resetUserPassword(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/resetUserPassword', info);
    return resultInfo;
  }

  /**
   * 用户管理
   * 查询系统所有角色
   * @returns {Observable<any>}
   */
  getAllRole(): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/getAllRole', null );
    return resultInfo;
  }

  /**
   * 用户管理
   * 修改用户角色关联信息
   * @param mlist
   * @returns {Observable<any>}
   */
  modifyUserRole(mlist): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/role/modifyUserRole', mlist);
    return resultInfo;
  }

  /**
   * 用户管理
   * 查询用户的角色信息
   * @param user
   * @returns {Observable<any>}
   */
  getUserRole(user): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/role/getUserRole', user);
    return resultInfo;
  }

  /**
   * 角色管理
   * 查询角色信息
   * @param queryInfo
   * @returns {Observable<any>}
   */
  getRoleInfoList(pageInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/role/getRoleList', pageInfo);
    return resultInfo;
  }

  /**
   * 角色管理
   * 修改角色信息
   * @param roleInfo
   * @returns {Observable<any>}
   */
  modifyRoleInfo(roleInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/role/updateRole', roleInfo);
    return resultInfo;
  }

  /**
   * 角色管理
   * 添加角色信息
   * @param roleInfo
   * @returns {Observable<any>}
   */
  addRoleInfo(roleInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/role/addRole', roleInfo);
    return resultInfo;
  }

  /**
   * 角色管理
   * 删除角色信息
   * @param id
   * @returns {Observable<any>}
   */
  deleteRoleInfo(id): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/role/delete', {id: id});
    return resultInfo;
  }

  /**
   * 角色管理
   * 根据角色id获取相应的权限树信息
   * @param roleId
   * @returns {Observable<any>}
   */
  getPermissionZTreeNodes(roleId): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/getPermissionZTreeNodes', {id: roleId});
    return resultInfo;
  }

  /**
   * 角色管理
   * 修改角色所拥有的权限信息
   * @param listInfo
   * @returns {Observable<any>}
   */
  modifyRolePermission(listInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/modifyRolePermission', listInfo);
    return resultInfo;
  }

  /**
   * 权限管理
   * 查询权限信息
   * @returns {Observable<any>}
   */
  getPermInfoList(pageInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/getPermList', pageInfo);
    return resultInfo;
  }

  /**
   * 权限管理
   * 获取所有权限信息
   * @returns {Observable<any>}
   */
  getAllPermInfoList(): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/getAllPermList', null);
    return resultInfo;
  }

  /**
   * 权限管理
   * 根据权限id删除权限信息
   * @param id
   * @returns {Observable<any>}
   */
  deletePermissionInfo(id): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/deletePermissionRole', {id: id});
    return resultInfo;
  }

  /**
   * 权限管理
   * 批量删除权限信息
   * @param id
   * @returns {Observable<any>}
   */
  batchDeletePermissionInfo(id): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/batchDeletePermissionRole', {id: id});
    return resultInfo;
  }
  /**
   * 权限管理
   * 编辑权限信息
   * @param info
   * @returns {Observable<any>}
   */
  modifyPermissionInfo(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/updatePermission', info);
    return resultInfo;
  }
  /**
   * 权限管理
   * 添加权限信息
   * @param info
   * @returns {Observable<any>}
   */
  addPermissionInfo(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/permission/addPermission', info);
    return resultInfo;
  }

  /**
   * 字典管理
   * 查询字典信息
   * @param queryInfo
   * @returns {Observable<any>}
   */
  getSysDictInfoList(pageInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysDict/getDictList', pageInfo);
    return resultInfo;
  }

  /**
   * 字典管理
   * 编辑字典信息
   * @param info
   * @returns {Observable<any>}
   */
  modifyDictInfoList(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysDict/updateSysDict', info);
    return resultInfo;
  }

  /**
   * 字典管理
   * 添加字典信息
   * @param info
   * @returns {Observable<any>}
   */
  addDictInfoList(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysDict/addSysDict', info);
    return resultInfo;
  }

  /**
   * 字典管理
   * 查询字典信息中有哪些类型
   * @returns {Observable<any>}
   */
  getAllDictTypeList(): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysDict/getAllDictTypeList', null);
    return resultInfo;
  }

  /**
   * 字典管理
   * 删除字典信息
   * @param id
   * @returns {Observable<any>}
   */
  deleteSysDictInfo(id): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysDict/delete', {id: id});
    return resultInfo;
  }

  /**
   * 日志管理
   * 查询日志信息
   * @param queryInfo
   * @returns {Observable<any>}
   */
  getSysLogInfoList(pageInfo): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysLogs/getSysLogsList', pageInfo);
    return resultInfo;
  }

  /**
   * 日志管理
   * 根据id删除日志信息
   * @param id
   * @returns {Observable<any>}
   */
  deleteSysLogInfo(id): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysLogs/delete', {id: id});
    return resultInfo;
  }

  /**
   * 日志管理
   * 根据时间条件删除日志信息
   * @param info
   * @returns {Observable<any>}
   */
  deleteSysLogInfoBetweenTime(info): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/sysLogs/deleteBetweenTime', info);
    return resultInfo;
  }

  /**
   * 查询当前用户
   * @returns {Observable<any>}
   */
  getCurrentUserInfo(): Observable<any> {
    const resultInfo = this.httpServ.post(this.baseURL + '/manage/user/getCurrentUserInfo', null);
    return resultInfo;
  }


  /**
   * 根据不同的组件弹出模态框
   * @param message
   * @param component
   * @returns {Observable<any>}
   */
  showModal(message, component): Observable<any> {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(component, {
      disableClose: true,
      width: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }

}
