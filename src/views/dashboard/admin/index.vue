<template>
	<div class="dashboard-editor-container">
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

	export default {
  	name: 'dashboard-admin',
  	computed: {
    	...mapGetters([
      	'name',
      	'avatar',
      	'roles'
    	])
  	}
	}
</script>
