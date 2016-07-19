import mongoose from 'mongoose';
import {schemaOpts} from './base';

const RepoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: mongoose.Types.ObjectId
    },
    slug: String,
    description: String,
    url: String,
    cloneUrl: String,
    branches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Branch'}],
}, schemaOpts);

RepoSchema.set('toJSON', {getters: true});

export default mongoose.model('Repo', RepoSchema);
