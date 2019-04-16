import _ from 'lodash';
import userModel from './user';

export default class postModel {
    constructor(props) {
        this.id = _.get(props, 'id', null);
        this.title = _.get(props, 'title', '');
        this.content = _.get(props, 'content', '');
        this.description = _.get(props, 'description', '');
        this.created_at = _.get(props, 'created_at', '');
        this.user_id = _.get(this.user, 'id', null);
        this.user = new userModel(_.get(props, 'user', null));
    }

    get time() {
    	return moment(this.created_at).format('DD-MM-YYYY, HH:mm');
    }
}
