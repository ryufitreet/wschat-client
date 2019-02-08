import { schema } from 'normalizr';

export const userSchema = new schema.Entity('users');
export const messageSchema = new schema.Entity('message', {
  user: userSchema,
});

export const messageListScheme = new schema.Array(messageSchema);

export default {
  userSchema,
  messageSchema,
  messageListScheme,
}
