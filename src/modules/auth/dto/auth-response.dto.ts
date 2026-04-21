export class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        name: string;
        lastname: string;
        role: string;
    };
}
