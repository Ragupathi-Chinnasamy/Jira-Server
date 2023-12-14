import { sign } from 'jsonwebtoken';
import { config } from './config';

export const roles = ['Admin', 'User'];

export const taskStatus = ['Todo', 'Inprogress', 'Resolved', 'Reopened'];

export const taskType = ['Task', 'Bug'];

export async function generateWebToken(userId: number): Promise<string> {
  const dataStoredInToken = {
    id: userId,
  };
  const secretKey: string = config.JWT_SECRET_KEY;
  const token = sign(dataStoredInToken, secretKey, {
    expiresIn: 24 * 60 * 60,
  });

  return token;
}

export interface PaginatedResponse {
  from: number;
  to: number;
  total: number;
  totalPages: number;
  data: any[];
}

export const paginationResponse = (
  page: number,
  itemsPerPage: number,
  total: number,
  data: any[],
) => {
  let from = 0;
  let to = 0;
  if (page > 0) {
    const offset = (page - 1) * itemsPerPage;
    if (total > 0) {
      from = offset + 1;
      if (offset + itemsPerPage > total) {
        to = total;
      } else {
        to = offset + itemsPerPage;
      }
    }
  } else {
    from = 1;
    to = total;
  }
  return {
    from,
    to,
    total,
    totalPages: page == 0 ? 1 : Math.ceil(total / itemsPerPage),
    data,
  };
};

export function calculateSkipAndTake(page: number, itemsPerPage: number) {
  const skip = page <= 1 ? 0 : (page - 1) * 10;
  const take = page == 0 ? undefined : itemsPerPage;

  return { skip, take };
}
