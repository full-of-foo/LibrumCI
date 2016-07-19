const schemaOpts = {
    versionKey: false,
    strict: true,
    minimize: false,
    timestamps: true,
    id: false,
};

const _getById = function getById(id){
    return new Promise((resolve, reject) => {
        this.findById({_id:id}).exec((err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
};
const _findAndUpdate = function findAndUpdate(id, data){
    return new Promise((resolve, reject) => {
        this.findOneAndUpdate({_id: id}, data, {new: true}, (err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
};

const addHelperFns = Schema => {
    Schema.statics.getById = _getById;
    Schema.statics.findAndUpdate = _findAndUpdate;
};

export {schemaOpts, addHelperFns};
