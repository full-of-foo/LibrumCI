import mongoose from './../utils/mongoose';
import {schemaOpts, addHelperFns} from './base';

const RepoSchema = new mongoose.Schema({
    slug: {type: String, required : true, index:{ unique:true }},
    description: String,
    url: {type: String},
    cloneUrl: {type: String},
    dockerRunCommand: {type: String, required: true},
    envVars: [{
        key: {type: String, required: true},
        value: {type: String, required: true},
    }]
}, schemaOpts);

RepoSchema.path('slug').validate(function(value, done) {
    this.model('Repo').count({ slug: value }, (err, count) => {
        if (err) return done(err);
        done(!count);
    });
}, 'Repo already exists');

RepoSchema.set('toJSON', {getters: true, virtual: true});
addHelperFns(RepoSchema);

export default mongoose.model('Repo', RepoSchema);
