<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <template v-for="(item, index) in posts">
            <div class="post-preview">
                <router-link :to="{ name: 'post', params: { id: item.id }}">
                    <h2 class="post-title">{{ item.title }}</h2>
                    <h3 class="post-subtitle">{{ item.description }}</h3>
                </router-link>
                <p class="post-meta">Đăng bởi {{ item.user.name }} vào {{ item.time }}</p>
            </div>
            <hr v-if="index !== posts.length - 1">
        </template>
        <div id="load-more">
            <button class="btn btn-primary" v-if="meta && meta.current_page < meta.last_page" @click="getPosts()">Tải thêm</button>
        </div>
    </div>
</template>

<script>
    import postModel from 'js/models/post';
    export default {
        data: () => ({
            posts: [],
            meta: null,
        }),
        created() {
            this.$store.dispatch('setTitle', 'Vue Blog');
            this.getPosts();
        },
        methods: {
            getPosts() {
                const loader = this.$loading.show();
                const nextPage = _.get(this.meta, 'current_page', 0) + 1;
                axios.get('/api/posts?page=' + nextPage).then(res => {
                    loader.hide();
                    _.get(res, 'data.data', null).forEach(item => {
                        this.posts.push(new postModel(item));
                    });
                    this.meta = _.get(res, 'data.meta', null);
                }).catch(err => {
                    loader.hide();
                });
            },
        }
    }
</script>
