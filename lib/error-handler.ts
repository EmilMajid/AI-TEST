import { NextResponse } from "next/server"

export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  CONFLICT = "CONFLICT",
  RATE_LIMIT = "RATE_LIMIT",
}

export interface ApiError {
  code: ErrorCode
  message: string
  details?: any
  statusCode: number
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode = 400,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function errorResponse(error: Error | ApiError | unknown, statusCode = 500): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: error.message,
        },
      },
      { status: statusCode },
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Unknown error occurred",
      },
    },
    { status: 500 },
  )
}
