import mongoose from 'mongoose'

interface ConnectionOptions {
    mongoUri: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect({ mongoUri, dbName }: ConnectionOptions) {
        try {
            await mongoose.connect(mongoUri, {
                dbName
            })
        } catch (error) {
            console.log('Mongo connection error');
            throw error
        }
    }
}