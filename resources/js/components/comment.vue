<template>
    <div>
        <h4>Bình luận</h4>
        <hr>
        <p v-for="item in comments">[{{ item.time }}] {{ item.user.name }}: {{ item.body }}</p>
        <template v-if="$store.state.user">
            <div class="control-group">
                <div class="form-group floating-label-form-group controls">
                    <label>Nội dung</label>
                    <textarea name="body" rows="5" v-validate="'required'" class="form-control" placeholder="Nội dung" v-model="body" data-vv-as="nội dung"></textarea>
                    <p class="help-block text-danger">{{ errors.first('body') }}</p>
                </div>
            </div>
            <br>
            <div class="form-group">
                <button class="btn btn-primary" @click="postComment()">Đăng bình luận</button>
            </div>
        </template>
        <template v-else>
            <p>Vui lòng <router-link :to="{ name: 'login' }">đăng nhập</router-link> để đăng bình luận</p>
        </template>
    </div>
</template>

<script>
    import Echo from 'laravel-echo';
    import Pusher from 'pusher-js';
    import commentModel from 'js/models/comment';
    export default {
        data: () => ({
            comments: [],
            body: '',
            echo: null
        }),
        props: {
            postId: null,
        },
        created() {
            this.getComment();
            this.connectPusher();
        },
        destroyed() {
            if(this.echo) {
                this.echo.disconnect();
            }
        },
        methods: {
            getComment() {
                const loader = this.$loading.show();
                axios.get('/api/comments/' + this.$route.params.id).then(res => {
                    loader.hide();
                    this.comments = _.get(res, 'data.data', null).map(item => {
                        return new commentModel(item);
                    });
                }).catch(err => {
                    loader.hide();
                });
            },
            postComment() {
                this.$validator.validateAll().then(result => {
                    if(result) {
                        const input = {
                            body: this.body,
                            post_id: this.$route.params.id,
                            user_id: this.$store.state.user.id,
                        };
                        const loader = this.$loading.show();
                        axios.post('/api/comments', input).then(res => {
                            loader.hide();
                            this.comments.push(new commentModel(_.get(res, 'data.data', null)));
                            this.body = '';
                        }).catch(err => {
                            loader.hide();
                        });
                    }
                });
            },
            connectPusher() {
                if(localStorage.getItem('api_token')) {
                    // Pusher.logToConsole = true;
                    this.echo = new Echo({
                        broadcaster: 'pusher',
                        key: process.env.MIX_PUSHER_APP_KEY,
                        cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                        encrypted: true,
                        auth: {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('api_token'),
                                Accept: 'application/json',
                            }
                        }
                    });
                    this.echo.private("comment").listen("CommentSent", e => {
                        this.comments.push(new commentModel(e.comment));
                    });
                }
            }
        },
    }
</script>
