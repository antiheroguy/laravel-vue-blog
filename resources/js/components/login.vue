<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Email</label>
                <input name="email" v-validate="'required|email'" type="text" class="form-control" placeholder="Email" v-model="user.email">
                <p class="help-block text-danger">{{ errors.first('email') }}</p>
            </div>
        </div>
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Mật khẩu</label>
                <input name="password" v-validate="'required'" type="password" class="form-control" placeholder="Mật khẩu" v-model="user.password" data-vv-as="mật khẩu">
                <p class="help-block text-danger">{{ errors.first('password') }}</p>
            </div>
        </div>
        <br>
        <div id="success">
            <div class="alert alert-warning" role="alert" v-if="message">{{ message }}</div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-primary" @click="login()">Đăng nhập</button>
        </div>
    </div>
</template>

<script>
    import userModel from 'js/models/user';
    export default {
        data: () => ({
            user: new userModel(),
            message: '',
        }),
        created() {
            if(localStorage.getItem('api_token')) {
                this.$router.push({name : 'home'});
            }
            this.$store.dispatch('setTitle', 'Đăng nhập');
        },
        methods: {
            login() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        const loader = this.$loading.show();
                        axios.post('/api/login', this.user).then(res => {
                            loader.hide();
                            const user = new userModel(_.get(res, 'data.user'));
                            this.$store.dispatch('login', user);
                        }).catch(err => {
                            loader.hide();
                            this.message = _.get(err, 'response.data.message', '');
                        });
                    }
                });   
            }
        }
    }
</script>
