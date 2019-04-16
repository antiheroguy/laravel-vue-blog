<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <h2>Không tìm thấy nội dung</h2>
    </div>
</template>

<script>
	export default {
	    created() {
	        this.$store.dispatch('setTitle', '404');
	    }
	}
</script>
