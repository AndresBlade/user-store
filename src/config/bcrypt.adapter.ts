import { compare, genSalt, hash } from "bcryptjs"

export const bcryptAdapter = {
    hash: async (password: string) => {
        const salt = await genSalt();
        return await hash(password, salt);
    },

    compare: async (password: string, hash: string) => {
        return await compare(password, hash)
    }
}