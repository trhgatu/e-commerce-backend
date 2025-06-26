import jwt from 'jsonwebtoken'
import { IUser } from '@modules/user/user.model'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN = '10s' // 10 seconds for testing, change to '15m' or '1h' in production
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export interface AccessTokenPayload {
  _id: string
  roleId?: string
  status: string
  email: string
  fullName: string
  username: string
}

export interface RefreshTokenPayload {
  _id: string
}

// Generate Access Token
export const generateAccessToken = (user: IUser): string => {
  const payload: AccessTokenPayload = {
    _id: user._id.toString(),
    roleId: user.roleId?.toString(),
    status: user.status,
    email: user.email,
    fullName: user.fullName,
    username: user.username
  }

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  })
}

// Generate Refresh Token
export const generateRefreshToken = (user: IUser): string => {
  const payload: RefreshTokenPayload = {
    _id: user._id.toString(),
  }

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })
}

// Verify Access Token
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload
}

// Verify Refresh Token
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload
}