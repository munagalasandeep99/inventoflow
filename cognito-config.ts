import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const poolData = {
  UserPoolId: 'us-east-1_um9qzP9an',
  ClientId: '59i01d4vd4fq4cig7q9jcdmelo',
};

export const userPool = new CognitoUserPool(poolData);
