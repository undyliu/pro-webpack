<template>
	<div class="dashboard-editor-container">
    this is the admin dashboard.
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
