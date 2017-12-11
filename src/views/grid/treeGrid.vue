<template>
	<el-table :data='model.menus' border max-height='400'>
            <el-table-column
                prop='id' 
                label='id' 
                type='selection'
                fixed></el-table-column >
            <el-table-tree-column  
                fixed
                :expand-all='!!!1'
                :remote='remote'
                file-icon='icon icon-file' 
                folder-icon='icon icon-folder' 
                prop='label' 
                label='title' 
                :show-overflow-tooltip='true' 
                width='320'>
                <template scope='scope' >
                    <span>prefix =></span>
                    <span @click='text(scope)'>{{scope.row.label}} -- {{scope.row.id}}</span> 
                    <span><= suffix</span>   
                </template>
            </el-table-tree-column>
            <el-table-column 
                prop='description' 
                label='Description' 
                width='180'
                ></el-table-column >
        </el-table>
</template>

<script>
var trees = [{
	'id': 1,
  'label': 'System',
  'parent_id': null,
  'url': null,
  'depth': 0,
  'child_num': 3,
  'description': 'System Manager',
  'children': [{
         'id': 2,
         'label': 'base',
         'parent_id': 1,
         'url': null,
         'depth': 1,
         'child_num': 5,
         'description': 'Base Manager',
         'expanded':true,
         'children': [{
             'id': 3,
             'label': 'Menus',
             'parent_id': 2,
             'url': '/menus',
             'depth': 2,
             'child_num': 0,
             'description': 'menu manager',
         }, {
             'id': 4,
             'label': 'Roles',
             'parent_id': 2,
             'url': '/roles',
             'depth': 2,
             'child_num': 0,
             'description': 'Role Manager',
         }, {
             'id': 5,
             'label': 'Users',
             'parent_id': 2,
             'url': '/users',
             'depth': 2,
             'child_num': 0,
             'description': 'User Manager',
         }]
     }]
 }]
export default {
  name: 'func',
  data () {
    return {
    	model: { menus: trees }
    }
  },
  methods:{
    remote(row,callback){
      setTimeout(function() {
        callback(row.children)
      },500)
    }
  }
}
</script>