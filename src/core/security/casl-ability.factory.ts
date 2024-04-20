import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { PostDto, UserDto, UserRole } from '../models';

type Subjects = InferSubjects<typeof PostDto | typeof UserDto> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects], MongoQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDto) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<[Action, Subjects], MongoQuery>,
    );

    if (user.isAdminOrOwner()) {
      can(Action.Manage, [PostDto]);
    }

    can(Action.Update, PostDto, { authors: { id: user.id } });
    can(Action.Delete, PostDto, { authors: { id: user.id } });
    if (user.role === UserRole.CONTRIBUTOR) {
      cannot(Action.Delete, PostDto);
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
