import _ from 'lodash';
import postModel from './post';
import userModel from './user';

export default class commentModel {
    constructor(props) {
        this.id = _.get(props, 'id', null);
        this.post = new postModel(_.get(props, 'post', null));
        this.user = new userModel(_.get(props, 'user', null));
        this.body = _.get(props, 'body', '');
        this.created_at = _.get(props, 'created_at', '');
        this.post_id = _.get(this.post, 'id', null);
        this.user_id = _.get(this.user, 'id', null);
    }

    get time() {
    	return moment.duration(moment().diff(moment(this.created_at))).locale("vi").humanize();
    }
}
