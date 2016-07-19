import mongoose from 'mongoose';
import {schemaOpts} from './base';

const BranchSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: mongoose.Types.ObjectId
    },
    slug: Number,
    repoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Repo'},
    builds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Build'}],
}, schemaOpts);

BranchSchema.set('toJSON', {getters: true});

export default mongoose.model('Branch', BranchSchema);
