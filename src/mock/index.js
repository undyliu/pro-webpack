import Mock from 'mockjs'
import loginAPI from './login'
import roleAPI from './auth/role'
import sysModelAPI from './auth/sysModel'
import funcAPI from './auth/func'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 角色相关
Mock.mock(/\/role\/list/, 'get', roleAPI.getList)
// 模块相关
Mock.mock(/\/sysModel\/list/, 'get', sysModelAPI.getList)
// 功能相关
Mock.mock(/\/func\/list/, 'get', funcAPI.getList)

export default Mock
