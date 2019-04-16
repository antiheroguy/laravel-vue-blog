<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Tiêu đề</label>
                <input name="title" v-validate="'required'" type="text" class="form-control" placeholder="Tiêu đề" v-model="post.title" data-vv-as="tiêu đề">
                <p class="help-block text-danger">{{ errors.first('title') }}</p>
            </div>
        </div>
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Mô tả</label>
                <input name="description" v-validate="'required|min:10'" type="text" class="form-control" placeholder="Mô tả" v-model="post.description" data-vv-as="mô tả">
                <p class="help-block text-danger">{{ errors.first('description') }}</p>
            </div>
        </div>
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Nội dung</label>
                <wysiwyg v-model="post.content" />
            </div>
        </div>
        <br>
        <div class="form-group">
            <button class="btn btn-primary" @click="goBack()">Quay lại</button>
            <button class="btn btn-success" @click="handlePost()">OK</button>
        </div>
    </div>
</template>

<script>
    import postModel from 'js/models/post';
    export default {
        data: () => ({
            post: new postModel(),
        }),
        created() {
            this.$store.dispatch('setTitle', this.$route.params.id ? 'Sửa bài viết' : 'Bài viết mới');
            this.getPost();
        },
        methods: {
            getPost() {
                const id = this.$route.params.id;
                if (id) {
                    const loader = this.$loading.show();
                    axios.get('/api/posts/' + id).then(res => {
                        if(id !== this.$store.state.user.id) {
                            this.$router.push({name : 'home'});
                        }
                        loader.hide();
                        this.post = new postModel(res.data.data);
                    }).catch(err => {
                        loader.hide();
                    });
                }
            },
            handlePost() {
                this.$validator.validateAll().then(result => {
                    if(result) {
                        const id = this.$route.params.id;
                        const loader = this.$loading.show();
                        if (id) {
                            axios.put('/api/posts/' + this.$route.params.id, this.post).then(res => {
                                loader.hide();
                                this.$router.push({name: 'home'});
                            }).catch(err => {
                                loader.hide();
                            });
                        } else {
                            this.post.user_id = this.$store.state.user.id;
                            axios.post('/api/posts', this.post).then(res => {
                                loader.hide();
                                this.$router.push({name: 'home'});
                            }).catch(err => {
                                loader.hide();
                            });
                        }
                    }
                });
            },
            goBack() {
                this.$router.back();
            }
        }
    }
</script>
