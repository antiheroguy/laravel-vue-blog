<template>
    <div class="col-lg-8 col-md-10 mx-auto">
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Tên</label>
                <input name="name" type="text" v-validate="'required'" class="form-control" placeholder="Tên" v-model="user.name" data-vv-as="tên">
                <p class="help-block text-danger">{{ errors.first('name') }}</p>
            </div>
        </div><div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Email</label>
                <input name="email" type="email" v-validate="'required|email'" class="form-control" placeholder="Email" v-model="user.email">
                <p class="help-block text-danger">{{ errors.first('email') }}</p>
            </div>
        </div>
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Mật khẩu</label>
                <input name="password" v-validate="'required|min:6'" type="password" class="form-control" placeholder="Mật khẩu" v-model="user.password" data-vv-as="mật khẩu" ref="password">
                <p class="help-block text-danger">{{ errors.first('password') }}</p>
            </div>
        </div>
        <div class="control-group">
            <div class="form-group floating-label-form-group controls">
                <label>Mật khẩu nhập lại</label>
                <input name="password_confirmation" v-validate="'required|confirmed:password'" type="password" class="form-control" placeholder="Mật khẩu nhập lại" v-model="password_confirmation" data-vv-as="mật khẩu nhập lại">
                <p class="help-block text-danger">{{ errors.first('password_confirmation') }}</p>
            </div>
        </div>
        <br>
        <div id="success">
            <div class="alert alert-warning" role="alert" v-if="message">{{ message }}</div>
        </div>
        <div class="form-group">
            <button class="btn btn-primary" @click="register()">Đăng ký</button>
        </div>
    </div>
</template>

<script>
    import userModel from 'js/models/user';
    export default {
        data: () => ({
            user: new userModel(),
            password_confirmation: '',
            message: '',
        }),
        created() {
            if(localStorage.getItem('api_token')) {
                this.$router.push({name : 'home'});
            }
            this.$store.dispatch('setTitle', 'Đăng ký');
        },
        methods: {
            register() {
                this.$validator.validateAll().then(result => {
                    if(result) {
                        const loader = this.$loading.show();
                        axios.post('/api/register', this.user).then(res => {
                            loader.hide();
                            const user = new userModel(_.get(res, 'data.user'));
                            this.$store.dispatch('login', user);
                        }).catch(err => {
                            loader.hide();
                            if(_.get(err, 'response.data.errors.email', '')) {
                                this.message = 'Email đã tồn tại trong hệ thống';
                            }
                        });
                    }
                });
            }
        }
    }
</script>
