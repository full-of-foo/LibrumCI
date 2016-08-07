import request from 'request-promise';
import {Repo, Branch, Build} from 'librum-ci-models';
import Promise from 'bluebird';
import config from '../../config';

const _extractRepoData = payload => {
    return {
        slug: payload.repository.full_name,
        description: payload.repository.description,
        url: payload.repository.url,
        cloneUrl: payload.repository.clone_url
    };
};
const _extractBuildData = payload => {
    return {
        state: 'Queued',
        compareUrl: payload.compare,
        commits: payload.commits.map(c => {
            return {
                sha: c.id,
                commitedAt: c.timestamp,
                authorName: c.author.username,
                authorEmail: c.author.email,
                url: c.url,
                isHead: c.id === payload.head_commit.id
            };
        })
    };
};

const upsertPushData = (repoData, branchData, buildData) => {
    return Repo.upsert({slug: repoData.slug}, repoData)
        .then(repo => {
            console.log(repo);
            branchData.repo = repo._id;
            console.log('Upserting Branch:', branchData.slug);
            return Branch.upsert(branchData, branchData)
                .then(branch => {
                    buildData.branch = branch._id;
                    console.log('Upserting Build');
                    return Build.upsert(buildData, buildData)
                        .catch(err => console.error(`Could not upsert build: ${err}`));
                })
                .catch(err => console.error(`Could not upsert branch: ${err}`));
        })
        .catch(err => console.error(`Could not upsert repo: ${err}`));
};

const scheduleBuild = build => {
    const scheduleUri = `${config.librumMasterUri}/api/build/${build._id}/schedule`;
    return request.get({uri: scheduleUri, json: true})
        .then(json => console.log('Scheduled build: ', json))
        .catch(err => console.error(`Could not schedule build ${build._id}`, err));
};

const onPush = event => {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);

    const repoData = _extractRepoData(event.payload);
    return Repo.find({slug: repoData.slug}).exec()
        .then(repos => {
            if (repos.length !== 1) return Promise.resolve(false);
            const branchData = {slug: event.payload.ref};
            const buildData = _extractBuildData(event.payload);

            return upsertPushData(repoData, branchData, buildData)
                        .then(build => {
                            scheduleBuild(build);
                            return Promise.resolve(true);
                        });
        });
};

export {onPush};
