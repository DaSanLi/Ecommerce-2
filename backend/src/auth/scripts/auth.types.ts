import { Request, Response } from "express";
import { ObjectType, Field } from '@nestjs/graphql';


export interface userResponse {
    email: string;
    password: string;
    deletedAt?: Date | null;
}


export interface payloadType {
    email: string;
    token?: string;
}


export interface RequestWithUser extends Request {
    user?: payloadType;
}

export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
    domain?: string;
}

export interface ResponseWithCookie extends Response {
    cookie: (name: string, value: string, options?: CookieOptions) => this;
}


@ObjectType()
export class UserClass {
    @Field({ description: "Email del usuario autenticado" })
    email!: string;
}

@ObjectType()
export class VerificationResponse {
    @Field()
    message!: string;
    @Field()
    email!: string;
}
