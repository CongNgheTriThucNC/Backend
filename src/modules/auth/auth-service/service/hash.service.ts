import { compare, hash } from 'bcryptjs';
import { configStore } from '../../../../system/config/';

class HashService {
    private saltRounds: number;

    constructor() {
        this.saltRounds = +configStore.get('SALT_ROUNDS', '10');
    }

    async hash(input: string): Promise<string> {
        return hash(input, this.saltRounds);
    }

    async compare({
        raw,
        hashed,
    }: {
        raw: string;
        hashed: string;
    }): Promise<boolean> {
        return compare(raw, hashed);
    }
}

export const hashService = new HashService();
