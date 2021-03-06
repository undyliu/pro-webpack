<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sysModel" placeholder="人员类别">
        <el-option v-for="item in  userTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号" v-model="listQuery.mobile">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="150px" align="center" label="人员类别">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="150px" align="center" label="手机">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="setting" @click="handleSetAuth(scope.row)">角色设置
          </el-button>
          <el-button size="small" type="primary" icon="edit" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" icon="delete" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :rules="rules" ref="sysForm"  :model="sysForm" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="人员类别" prop="type">
          <el-select class="filter-item" v-model="sysForm.type" placeholder="请选择">
            <el-option v-for="item in  userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="sysForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input v-model="sysForm.pwd"></el-input>
        </el-form-item>

<!--
        <el-transfer
          v-model="value3"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :render-content="renderFunc"
          :titles="['未选', '已选']"
          :button-texts="['添加', '移除']"
          :footer-format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleChange"
          :data="data">
        </el-transfer>
-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色设置" :visible.sync="authSettingFormVisible">
      <el-form class="small-space" ref="settingForm" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/auth/user'
import waves from '@/directive/waves/index.js' // 水波纹指令

const userTypeOptions = [
  { key: 'supplier', display_name: '供应商' },
  { key: 'customer', display_name: '餐馆' }
]

export default {
  name: 'user',
  directives: {
    waves
  },
  data () {
    return {
      userTypeOptions,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        mobile: undefined,
        sort: '+id'
      },
      sysForm: {
        id: undefined,
        type: '',
        code: '',
        mobile: '',
        name: '',
        sex: '',
        pwd: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      tableKey: 0,
      rules: {
        type: [
          { required: true, message: '请选择人员', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 150 个字符', trigger: 'blur' }
        ]
      },
      authSettingFormVisible: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.resetSysForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleSetAuth (row) {
      this.authSettingFormVisible = true
    },
    handleUpdate (row) {
      this.sysForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    create () {
      /*
      this.temp.id = parseInt(Math.random() * 100) + 1024
      this.temp.timestamp = +new Date()
      this.temp.author = '原创作者'
      this.list.unshift(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      }) */
    },
    update () {
      /*
      this.temp.timestamp = +this.temp.timestamp
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, this.temp)
          break
        }
      }
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      }) */
    },
    resetSysForm () {
      this.sysForm = {
        id: undefined,
        name: '',
        desc: ''
      }
    }
  }
}
</script>
