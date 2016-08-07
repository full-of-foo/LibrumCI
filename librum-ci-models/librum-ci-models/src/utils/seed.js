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
    console.log('Seeding model data...');

    return Repo.find({slug: repoData.slug}).exec()
        .then(repos => {
            if (repos.length === 1) return Promise.resolve(false);

            return Repo.create(repoData).then(repo => {
                branchData.repo = repo._id;
                return Branch.create(branchData)
                    .then(branch => {
                        buildData.branch = branch._id;
                        return Build.create(buildData)
                            .then(build => {
                                console.log('Seeding model data finished');
                                return Promise.resolve(true);
                            });
                    });
            });
        });
};
