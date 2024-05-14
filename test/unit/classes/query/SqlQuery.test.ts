import SqlLogicalOperator from '../../../../src/classes/SqlLogicalOperator';
import SqlQuery, { SqlActions } from '../../../../src/classes/query/SqlQuery';

describe('SqlQuery', () => {
    describe('build', () => {
        const buildLogicalOperator = jest.spyOn(
            SqlLogicalOperator.prototype,
            'build'
        );

        it('builds into valid SQL with all fields', () => {
            const logicalOperator = new SqlLogicalOperator('AND');
            buildLogicalOperator.mockImplementationOnce(() => "name = 'john'");

            const query = new SqlQuery(
                SqlActions.Select,
                [],
                'test_table',
                logicalOperator
            );

            expect(query.action).toEqual('SELECT');
            expect(query.fields).toStrictEqual([]);
            expect(query.collection).toEqual('test_table');
            expect(query.build()).toEqual(
                "SELECT * FROM test_table WHERE name = 'john';"
            );
        });
        it('builds into valid SQL', () => {
            const logicalOperator = new SqlLogicalOperator('AND');
            buildLogicalOperator.mockImplementationOnce(() => "name = 'john'");

            const query = new SqlQuery(
                SqlActions.Select,
                ['name', 'id'],
                'test_table',
                logicalOperator
            );

            expect(query.action).toEqual('SELECT');
            expect(query.fields).toStrictEqual(['name', 'id']);
            expect(query.collection).toEqual('test_table');
            expect(query.build()).toEqual(
                "SELECT name, id FROM test_table WHERE name = 'john';"
            );
        });
    });
});
