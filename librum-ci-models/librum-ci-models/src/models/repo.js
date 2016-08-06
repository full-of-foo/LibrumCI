import mongoose from './../utils/mongoose';
import {schemaOpts, addHelperFns} from './base';

const RepoSchema = new mongoose.Schema({
    slug: {type: String, required: true},
    description: String,
    url: {type: String, required: true},
    cloneUrl: {type: String, required: true}
}, schemaOpts);

RepoSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(RepoSchema);

export default mongoose.model('Repo', RepoSchema);
