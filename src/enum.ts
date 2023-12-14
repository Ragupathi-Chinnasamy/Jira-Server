export enum Role {
  Admin = 1,
  User = 2,
}

export enum TaskStatus {
  ToDo = 1,
  InProgress = 2,
  Resolved = 3,
  Reopened = 4,
}

export enum TaskType {
  Task = 1,
  Bug = 2,
}

export enum AppError {
  UNIQUE_CONSTRAINT = '{0} already exist',
  USER_NOT_FOUND = 'User not found',
}
