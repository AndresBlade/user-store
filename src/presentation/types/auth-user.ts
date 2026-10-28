import type { UserEntity } from '../../domain/entity/user.entity';

export type AuthUser = Pick<
    UserEntity,
    'id' | 'name' | 'email' | 'emailValidated' | 'role'
>;
