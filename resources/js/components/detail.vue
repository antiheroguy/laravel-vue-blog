<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <div v-html="post.content"></div>
        <br>
        <comment :postId="$route.params.id"></comment>
    </div>
</template>

<script>
    import comment from 'js/components/comment';
    import postModel from 'js/models/post';
    export default {
        data: () => ({
            post: new postModel()
        }),
        created() {
            this.getPost();
        },
        methods: {
            getPost() {
                const loader = this.$loading.show();
                axios.get('/api/posts/' + this.$route.params.id).then(res => {
                    loader.hide();
                    this.post = new postModel(_.get(res, 'data.data', null));
                    this.$store.dispatch('setTitle', this.post.title);
                }).catch(err => {
                    loader.hide();
                });
            }
        },
        components: { comment }
    }
</script>
