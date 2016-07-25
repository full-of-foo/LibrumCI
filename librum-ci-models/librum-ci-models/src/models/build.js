import mongoose from 'mongoose';
import {schemaOpts, addHelperFns} from './base';

const BuildSchema = new mongoose.Schema({
    number: Number,
    state: {type: String, required: true}, // TODO - enum
    startedAt: Date,
    finishedAt: Date,
    compareUrl: {type: String, required: true},
    commits: [{
        sha: {type: String, required: true},
        commitedAt: {type: Date, required: true},
        authorName: String,
        authorEmail: String,
        url: {type: String, required: true},
        isHead: {type: Boolean, required: true}
    }],
    branch: {type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true}
}, schemaOpts);

BuildSchema.path('commits').validate(commits => {
    if (!commits || commits && commits.length === 0) return false;
    return true;
}, 'Builds needs at least one commit');

BuildSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(BuildSchema);

export default mongoose.model('Build', BuildSchema);
