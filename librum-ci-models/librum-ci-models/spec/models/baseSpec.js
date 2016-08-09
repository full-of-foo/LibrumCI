import Promise from 'bluebird';
import mongoose from './../../src/utils/mongoose';
import {addHelperFns} from '../../lib/models/base';

const MockSchema = new mongoose.Schema({foo: String});
addHelperFns(MockSchema);
const MockModel = mongoose.model('Mock', MockSchema);

describe('BaseSchema: MockModel', () => {
    it('should be able to getById', done => {
        const mockId = new mongoose.Types.ObjectId();
        new MockModel({_id: mockId}).save((err, mock) => {
            const promise = MockModel.getById(mockId);
            expect(promise.constructor).toBe(Promise);
            promise.then(m => {
                expect(m._id.str).toBe(mockId.str);
                done();
            });
        });
    });

    it('should be able to update', done => {
        const mockId = new mongoose.Types.ObjectId();
        new MockModel({_id: mockId}).save((err, mock) => {
            const promise = MockModel.findAndUpdate(mockId, {foo: 'bar'});
            expect(promise.constructor).toBe(Promise);
            promise.then(m => {
                expect(m.foo).toBe('bar');
                done();
            });
        });
    });

    it('should be able to upsert', done => {
        const promise = MockModel.upsert({foo: 'bar'}, {foo: 'bar'});
        expect(promise.constructor).toBe(Promise);
        promise
            .then(m => {
                expect(m.foo).toBe('bar');
                MockModel.upsert({_id: m._id}, {foo: 'baz'})
                    .then(m2 => expect(m2.foo).toBe('baz'))
                    .then(done);
            });
    });
});
