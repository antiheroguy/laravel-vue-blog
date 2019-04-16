import _ from 'lodash';

export default class userModel {
    constructor(props) {
        this.id = _.get(props, 'id', null);
        this.name = _.get(props, 'name', '');
        this.email = _.get(props, 'email', '');
        this.password = _.get(props, 'password', '');
        this.api_token = _.get(props, 'api_token', '');
    }
}
