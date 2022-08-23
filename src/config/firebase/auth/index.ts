import { getAuth } from 'firebase/auth';
import { app } from '../core';

export const auth = getAuth(app);