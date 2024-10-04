import {
  bigint,
  integer,
  serial,
  varchar,
  text,
  timestamp,
  pgTable,
  boolean,
  jsonb,
  pgEnum,
  doublePrecision
} from 'drizzle-orm/pg-core';

import {relations} from 'drizzle-orm';

// Define the enum
export const userStatusEnum = pgEnum('user_status', ['waiting_list', 'main_net', 'suspended']);

// Define the users table
export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  username: varchar('username', {length: 255}),
  email: varchar('email', {length: 255}),
  hashedPassword: text('hashed_password'),
  createdAt: timestamp('created_at').defaultNow(),
  githubUsername: varchar('github_username', {length: 255}),
  githubUrl: varchar('github_url', {length: 255}),
  wallet: varchar('wallet_address', {length: 255}).notNull(),
  imageUrl: varchar('image_url', {length: 255}),
  currentStatus: userStatusEnum('current_status').notNull().default('waiting_list'),
  referralCode: varchar('referral_code', {length: 255}).unique(),
  referredBy: text('referred_by').references(() => users.id),
  rank: integer('rank').default(0),
  referralsCount: integer('referrals_count').default(0),
  joinPosition: integer('join_position').default(0),
  nRef: doublePrecision('n_ref').default(0),
  nJoin: doublePrecision('n_join').default(0),
  weightedScore: doublePrecision('weighted_score').default(0),
  points: doublePrecision('points').default(0),
  emailNotifications: boolean('email_notifications').default(false),
});

// Define the agents table
export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  name: varchar('name', {length: 255}),
  description: text('description'),
  skills: text('skills').array(),
  website: varchar('website', {length: 255}),
  telegram: varchar('telegram', {length: 255}),
  twitter: varchar('twitter', {length: 255}),
  github: varchar('github', {length: 255}),
  tokenName: varchar('token_name', {length: 255}),
  tokenSymbol: varchar('token_symbol', {length: 255}),
  contributorPoolPercentage: integer('contributor_pool_percentage'),
  coinCurrency: varchar('coin_currency', {length: 255}),
  initialBuyAmount: integer('initial_buy_amount'),
  metaData: jsonb('meta_data'),
  vEth: integer('v_eth'),
  vToken: integer('v_token'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define the referrals table
export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  referredByUserId: text('referred_by_user_id').references(() => users.id),
  referralCode: varchar('referral_code_at', {length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  status: varchar('status', {length: 255}).default('pending'),
});

//preference table
export const preferences = pgTable('preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  preferenceEmail: varchar('preference_Email', {length: 255}),
  tokenHitting: boolean('token_hitting').default(false),
  emailNotification: boolean('email_notification').default(false)
});

export const userCode = pgTable('user_code', {
  id: serial('id').primaryKey(),
  email: varchar('email', {length: 255}).notNull(),
  code: integer('code'),
  createdAt: timestamp('created_at').defaultNow(),
})