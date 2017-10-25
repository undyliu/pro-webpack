import Mock from 'mockjs'
import loginAPI from './login'
import roleAPI from './role'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 角色相关
Mock.mock(/\/role\/list/, 'get', roleAPI.getList)

export default Mock
