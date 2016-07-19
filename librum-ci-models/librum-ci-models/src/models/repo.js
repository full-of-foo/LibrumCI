import mongoose from 'mongoose';
import {schemaOpts, addHelperFns} from './base';

const RepoSchema = new mongoose.Schema({
    slug: {type: String, required: true},
    description: {type: String, required: true},
    url: {type: String, required: true},
    cloneUrl: {type: String, required: true},
    branches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Branch', index: true}],
}, schemaOpts);

RepoSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(RepoSchema);

export default mongoose.model('Repo', RepoSchema);
