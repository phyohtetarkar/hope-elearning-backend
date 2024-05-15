export enum SubscriptionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export enum SubscriptionPlan {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class UserSubscriptionDto {
  id: string;

  constructor(partial: Partial<UserSubscriptionDto> = {}) {
    Object.assign(this, partial);
  }
}
