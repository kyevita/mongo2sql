import SqlCondition, {
    SqlConditionOperatorEnum,
} from '../../../src/classes/SqlCondition';

describe('SqlCondition', () => {
    describe('build', () => {
        it('builds conditions into valid SQL', () => {
            const operators = Object.values(SqlConditionOperatorEnum);

            for (const operator of operators) {
                const isInOp = operator === 'IN';

                const value: any = isInOp ? [1, 2] : true;
                const condition = new SqlCondition(operator, 'test', value);

                expect(condition.build()).toEqual(
                    `test ${operator} ${isInOp ? `(${value.join(', ')})` : value}`
                );
            }
        });

        it('parses values into valid SQL', () => {
            expect(new SqlCondition('=', 'test', 'string').build()).toEqual(
                "test = 'string'"
            );
            expect(new SqlCondition('=', 'test', 23).build()).toEqual(
                'test = 23'
            );
            expect(new SqlCondition('=', 'test', true).build()).toEqual(
                'test = true'
            );
            expect(new SqlCondition('=', 'test', false).build()).toEqual(
                'test = false'
            );
        });
    });
});
