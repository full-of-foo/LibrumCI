import mongoose from './../utils/mongoose';
import {schemaOpts, addHelperFns} from './base';

const BranchSchema = new mongoose.Schema({
    slug: {type: String, required: true},
    repo: {type: mongoose.Schema.Types.ObjectId, ref: 'Repo', required: true}
}, schemaOpts);

BranchSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(BranchSchema);

export default mongoose.model('Branch', BranchSchema);
