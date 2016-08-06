import mongoose from 'mongoose';
import seed from './seed';

export default function(config, callback) {
    console.log(`Creating DB: ${config.dbUri}`);
    mongoose.connect(config.dbUri);

    const connection = mongoose.connection;

    connection.on('disconnected', () => {
        console.log('Conn disconnected');
    });

    connection.on('error', err => {
        throw err;
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    connection.on('connected', () => {
        console.log(`Conn open to ${config.dbUri}`);

        if (config.isSeeded) {
            mongoose.connection.db.dropDatabase(() => seed().then(callback));
        } else {
            callback();
        }
    });
};
