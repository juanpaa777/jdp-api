export class user {
    id: number
    name: string
    lastname: string
    username: string
    password?: string
    hash?: string | null | undefined
    created_at: Date
}
