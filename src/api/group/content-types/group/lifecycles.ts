import { updateUserCount } from './lifecycles/userCount';

export default {
    async afterUpdate(event) {
        updateUserCount(event);
    },
    async beforeCreate(event) {
        // eslint-disable-next-line no-param-reassign
        event.params.data.publishedAt = new Date();
    },
    async beforeUpdate(event) {
        if (event.params.data.publishedAt === undefined) {
            // eslint-disable-next-line no-param-reassign
            event.params.data.publishedAt = new Date();
        }
    },
};
