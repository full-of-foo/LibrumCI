import mongoose from 'mongoose';

export default new mongoose.Schema({}, {
    versionKey: false,
    strict: false,
    minimize: false,
    timestamps: true
});
