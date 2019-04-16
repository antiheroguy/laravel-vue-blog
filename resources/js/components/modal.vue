<template>
    <div class="modal" :id="id">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" v-if="title">{{ title }}</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body" v-if="body">{{ body }}</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="confirm(true)">Có</button>
                    <button type="button" class="btn btn-danger" @click="confirm(false)">Không</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal',
        data: () => ({
            modal: {},
        }),
        props: {
            active: false,
            id: '',
            title: '',
            body: '',
        },
        mounted() {
            this.modal = $('#' + this.id);
            if (this.modal) {
                setTimeout(() => {
                    this.modal.on("hide.bs.modal", () => {
                        this.$emit('close');
                    }).on("show.bs.modal", () => {

                    });
                });
            }
        },
        watch: {
            active: function(val) {
                this.$nextTick(() => {
                    const action = val ? 'show' : 'hide';
                    this.modal.modal(action);
                });
            }
        },
        methods: {
            confirm(val) {
                this.$emit('close', val);
            }
        }
    }
</script>
