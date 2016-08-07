import Repo from '../models/repo';
import Branch from '../models/branch';
import Build from '../models/build';

const repoData = {
    slug: 'full-of-foo/sample-libreci-app',
    description: null,
    dockerRunCommand: 'echo pew;',
    url: 'https://github.com/full-of-foo/sample-libreci-app',
    cloneUrl: 'https://github.com/full-of-foo/sample-libreci-app.git'
};
const branchData = {
    slug: 'refs/heads/master'
};
const buildData = {
    state: 'scheduled',
    compareUrl: 'https://github.com/full-of-foo/sample-libreci-app/compare/486a4c3157ea...c809ed8f880d',
    commits: [{
        sha: 'c809ed8f880db6ce6ecb9c1ee2a7aedef0dac9b6',
        commitedAt: new Date(),
        url: 'https://github.com/full-of-foo/sample-libreci-app/commit/c809ed8f880db6ce6ecb9c1ee2a7aedef0dac9b6',
        isHead: true
    }]
};

export default () => {
    return new Promise((resolve, reject) => {
        console.log('Seeding model data...');
        new Repo(repoData).save((err, repo) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            branchData.repo = repo._id;
            new Branch(branchData).save((err2, branch) => {
                if (err2) {
                    console.error(err2);
                    reject(err2);
                }

                buildData.branch = branch._id;
                new Build(buildData).save((err3, build) => {
                    if (err2) console.error(err2);
                    console.log('Seeding model data finished');
                    (err3) ? reject(err3) : resolve();
                });
            });
        });
    });
};
