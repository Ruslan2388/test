export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export type RefreshTokenPayloadType = {
    sessionId: string;
    userId: string;
    exp: number;
    iat: number;
};
