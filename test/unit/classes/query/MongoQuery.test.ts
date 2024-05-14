import MongoQuery, {
    MongoActionsEnum,
} from '../../../../src/classes/query/MongoQuery';
import * as mongoQueryParser from 'mongodb-query-parser';

describe('MongoQuery', () => {
    describe('fromRawQuery', () => {
        const parseFilterSpy = jest.spyOn(mongoQueryParser, 'default');
        const isFilterValidSpy = jest.spyOn(mongoQueryParser, 'isFilterValid');
        const toJSStringSpy = jest.spyOn(mongoQueryParser, 'toJSString');

        beforeEach(() => {
            parseFilterSpy.mockClear();
            isFilterValidSpy.mockClear();
            toJSStringSpy.mockClear();
        });

        it('creates a MongoQuery from valid raw queries', () => {
            const mongoQueryWithFields = MongoQuery.fromRawQuery(
                'db.user.find({_id: 23113},{name: 1, age: 1});'
            );
            const mongoQueryWithoutFields = MongoQuery.fromRawQuery(
                "db.user.find({name: 'john'});"
            );

            expect(mongoQueryWithoutFields.action).toEqual('find');
            expect(mongoQueryWithoutFields.collection).toEqual('user');
            expect(mongoQueryWithoutFields.fields).toStrictEqual({});

            expect(mongoQueryWithFields.action).toEqual('find');
            expect(mongoQueryWithFields.collection).toEqual('user');
            expect(mongoQueryWithFields.fields).toStrictEqual({
                name: 1,
                age: 1,
            });

            expect(parseFilterSpy).toHaveBeenCalledTimes(2);
            expect(isFilterValidSpy).toHaveBeenCalledTimes(2);
            expect(toJSStringSpy).toHaveBeenCalledTimes(3);
        });

        it('should throw on invalid query params', () => {
            const rawQueryInvalid =
                'db.user.find({_id: 23113 invalid},{name: 1, age: 1})';

            expect(() => MongoQuery.fromRawQuery(rawQueryInvalid)).toThrow(
                `Invalid Mongo Raw Query: '${rawQueryInvalid}' is not a valid query`
            );
            expect(isFilterValidSpy).toHaveBeenCalledTimes(1);
            expect(parseFilterSpy).not.toHaveBeenCalled();
        });

        it('should throw on invalid fields params', () => {
            const rawQueryInvalid =
                'db.user.find({_id: 23113},{name: 1 invalid, age: 1})';

            expect(() => MongoQuery.fromRawQuery(rawQueryInvalid)).toThrow(
                `Invalid Mongo Raw Query: '${rawQueryInvalid}' is not a valid query`
            );
            expect(isFilterValidSpy).toHaveBeenCalledTimes(1);
            expect(parseFilterSpy).not.toHaveBeenCalled();
            expect(toJSStringSpy).not.toHaveBeenCalled();
        });

        it('should throw on invalid action', () => {
            const rawQueryInvalid = 'db.user.update({_id: 23113})';

            expect(() => MongoQuery.fromRawQuery(rawQueryInvalid)).toThrow(
                `Invalid Mongo Raw Query: Action 'update' is not supported`
            );
            expect(isFilterValidSpy).toHaveBeenCalledTimes(1);
            expect(parseFilterSpy).toHaveBeenCalledTimes(1);
            expect(toJSStringSpy).not.toHaveBeenCalled();
        });
    });

    describe('build', () => {
        it('should build a raw query from MongoQuery', () => {
            const mongoQuery = new MongoQuery(
                MongoActionsEnum.find,
                'test',
                { name: 'test' },
                { name: 1 }
            );

            expect(mongoQuery.action).toEqual('find');
            expect(mongoQuery.collection).toEqual('test');
            expect(mongoQuery.fields).toStrictEqual({
                name: 1,
            });

            expect(mongoQuery.build()).toEqual(
                "db.test.find({name:'test'},{name:1});"
            );
        });

        it('should return the same raw query on build call', () => {
            const rawQuery = 'db.user.find({_id:23113},{name:1,age:1});';
            const mongoQueryWithFields = MongoQuery.fromRawQuery(rawQuery);

            expect(mongoQueryWithFields.action).toEqual('find');
            expect(mongoQueryWithFields.collection).toEqual('user');
            expect(mongoQueryWithFields.fields).toStrictEqual({
                name: 1,
                age: 1,
            });

            expect(mongoQueryWithFields.build()).toEqual(rawQuery);
        });
    });
});
