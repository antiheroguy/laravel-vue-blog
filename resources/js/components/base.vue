<template>
	<div>
        <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
            <div class="container">
                <router-link :to="{ name: 'home' }" :class="'navbar-brand'">Trang chủ</router-link>
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <font-awesome-icon icon="bars" />
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                    	<template v-if="$store.state.user">
                            <li class="nav-item">
                        	   <router-link :to="{ name: 'profile' }" :class="'nav-link'">{{ $store.state.user.name }}</router-link>
                            </li>
                            <li class="nav-item">
                                <a href="javascript:;" class="nav-link" @click="logout()">Đăng xuất</a>
                            </li>
                        </template>
                        <template v-else>
	                        <li class="nav-item">
	                        	<router-link :to="{ name: 'login' }" :class="'nav-link'">Đăng nhập</router-link>
	                        </li>
	                        <li class="nav-item">
	                            <router-link :to="{ name: 'register' }" :class="'nav-link'">Đăng ký</router-link>
	                        </li>
                        </template>
                    </ul>
                </div>
            </div>
        </nav>
        <header class="masthead" style="background-image: url('/background.jpg')">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-10 mx-auto">
                        <div class="page-heading">
                            <h1>{{ title }}</h1>
                            <!-- <span class="subheading"></span> -->
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div class="container">
            <div class="row">
                <router-view></router-view>
            </div>
        </div>
        <hr>
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-10 mx-auto">
                        <ul class="list-inline text-center">
                            <li class="list-inline-item">
                                <a href="javascript:;" @click="scrollTop()">
                                    <span class="fa-stack fa-lg">
                                        <font-awesome-icon icon="circle" class="fa-stack-2x" />
                                        <font-awesome-icon icon="arrow-up" class="fa-stack-1x fa-inverse" />
                                    </span>
                                </a>
                            </li>
                        </ul>
                        <p class="copyright text-muted">Copyright &copy; 2019</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faBars, faCircle, faArrowUp } from '@fortawesome/free-solid-svg-icons';
	export default {
        created() {
            library.add(faBars, faCircle, faArrowUp);
            if(localStorage.getItem('api_token')) {
                const loader = this.$loading.show();
                axios.get('/api/user', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('api_token'),
                        Accept: 'application/json',
                    }
                }).then(res => {
                    loader.hide();
                    this.$store.commit('SET_AUTH_USER', res.data);
                }).catch(err => {
                    loader.hide();
                    localStorage.removeItem('api_token');
                });
            }
        },
		mounted() {
			$("body").on("input propertychange", ".floating-label-form-group", function(e) {
		        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
		    }).on("focus", ".floating-label-form-group", function() {
		        $(this).addClass("floating-label-form-group-with-focus");
		    }).on("blur", ".floating-label-form-group", function() {
		        $(this).removeClass("floating-label-form-group-with-focus");
		    });
            
		    if ($(window).width() > 992) {
		        let headerHeight = $('#mainNav').height();
		        $(window).on('scroll', { previousTop: 0 }, function() {
		            let currentTop = $(window).scrollTop();
		            if (currentTop < this.previousTop) {
		                if (currentTop > 0 && $('#mainNav').hasClass('is-fixed')) {
		                    $('#mainNav').addClass('is-visible');
		                } else {
		                    $('#mainNav').removeClass('is-visible is-fixed');
		                }
		            } else if (currentTop > this.previousTop) {
		                $('#mainNav').removeClass('is-visible');
		                if (currentTop > headerHeight && !$('#mainNav').hasClass('is-fixed')) $('#mainNav').addClass('is-fixed');
		            }
		            this.previousTop = currentTop;
		        });
		    }
		},
        computed: {
            title() {
                return this.$store.state.title
            }
        },
        methods: {
            scrollTop() {
                $("html, body").animate({ scrollTop: 0 }, 1500);
            },
            logout() {
                this.$store.dispatch('logout');
            },
        },
        components: { FontAwesomeIcon }
	}
</script>