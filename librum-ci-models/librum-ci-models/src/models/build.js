import mongoose from 'mongoose';
import {schemaOpts} from './base';

const BuildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: mongoose.Types.ObjectId
    },
    number: Number,
    state: String, // TODO - enum
    startedAt: Date,
    finishedAt: Date,
    compareUrl: String,
    commits: [{
        sha: String,
        commitedAt: Date,
        authorName: String,
        authorEmail: String,
        url: String,
        isHead: Boolean
    }],
    branchId: {type: mongoose.Schema.Types.ObjectId, ref: 'Branch'}
}, schemaOpts);

BuildSchema.set('toJSON', {getters: true});

export default mongoose.model('Build', BuildSchema);
