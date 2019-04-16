<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <router-link :to="{ name: 'create' }" type="button" class="btn btn-success">Thêm mới</router-link>
        <div class="clear" style="clear: both"></div>
        <br>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Tiêu đề</th>
                    <th>Người đăng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody v-if="posts">
                <tr v-for="post in posts">
                    <td>{{ post.title }}</td>
                    <td>{{ post.user.name }}</td>
                    <td>
                        <router-link :to="{ name: 'edit', params: { id: post.id }}" type="button" class="btn btn-primary">Sửa</router-link>
                        <a href="javascript:;" type="button" class="btn btn-danger" @click="deletePost(post.id)">Xóa</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <modal :active="showModal" @close="closeModal" :id="'modal'" :title="'Xóa bài viết?'"></modal>
    </div>
</template>

<script>
    import userModel from 'js/models/user';
    import postModel from 'js/models/post';
    import modal from 'js/components/modal';
    export default {
        data: () => ({
            posts: [],
            user: new userModel(),
            showModal: false,
            selectedId: null,
        }),
        created() {
            this.$store.dispatch('setTitle', 'Tài khoản');
            this.getPosts();
        },
        methods: {
            getPosts() {
                const loader = this.$loading.show();
                axios.get('/api/posts').then(res => {
                    loader.hide();
                    this.posts = _.get(res, 'data.data', null).filter(item => item.user.id === this.$store.state.user.id).map(item => {
                        return new postModel(item);
                    });
                }).catch(err => {
                    loader.hide();
                });
            },
            deletePost(id) {
                this.showModal = true;
                this.selectedId = id;
            },
            closeModal(value) {
                this.showModal = false;
                if(value) {
                    const loader = this.$loading.show();
                    axios.delete('/api/posts/' + this.selectedId).then(res => {
                        loader.hide();
                        this.getPosts();
                    }).catch(err => {
                        loader.hide();
                    });
                }
            },
        },
        components: { modal }
    }
</script>
