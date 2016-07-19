import mongoose from 'mongoose';
import {schemaOpts, addHelperFns} from './base';

const BranchSchema = new mongoose.Schema({
    slug: {type: String, required: true},
    repoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Repo', required: true},
    builds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Build', index: true}],
}, schemaOpts);

BranchSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(BranchSchema);

export default mongoose.model('Branch', BranchSchema);
