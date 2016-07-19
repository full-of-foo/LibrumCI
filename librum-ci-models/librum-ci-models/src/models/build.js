import mongoose from 'mongoose';
import {schemaOpts, addHelperFns} from './base';

const BuildSchema = new mongoose.Schema({
    number: Number,
    state: {type: String, required: true}, // TODO - enum
    startedAt: Date,
    finishedAt: Date,
    compareUrl: {type: String, required: true},
    commits: [{
        sha: String,
        commitedAt: Date,
        authorName: String,
        authorEmail: String,
        url: String,
        isHead: Boolean
    }],
    branchId: {type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true},
}, schemaOpts);

BuildSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(BuildSchema);

export default mongoose.model('Build', BuildSchema);
