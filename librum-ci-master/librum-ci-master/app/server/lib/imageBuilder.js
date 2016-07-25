import Docker from 'dockerode';

class ImageBuilder {
    constructor(build) {
        this.build = build;
        this.docker = new Docker();
    }
}

export default ImageBuilder;
