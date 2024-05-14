import SqlCondition from '../../../src/classes/SqlCondition';
import SqlLogicalOperator from '../../../src/classes/SqlLogicalOperator';

describe('SqlLogicalOperator', () => {
    describe('isLogicalOperator', () => {
        it('validates succesfully', () => {
            expect(SqlLogicalOperator.isLogicalOperator('AND')).toBeTruthy();
            expect(SqlLogicalOperator.isLogicalOperator('OR')).toBeTruthy();
            expect(SqlLogicalOperator.isLogicalOperator('IN')).toBeFalsy();
            expect(SqlLogicalOperator.isLogicalOperator('>')).toBeFalsy();
        });
    });

    describe('addChildCondition', () => {
        it('adds child condition successfully to logical operator', () => {
            const operator = new SqlLogicalOperator('AND');
            expect(operator.children).toHaveLength(0);

            operator.addChild(new SqlCondition('=', 'test', true));
            expect(operator.children).toHaveLength(1);
        });

        it('adds child successfully to logical operator', () => {
            const operator = new SqlLogicalOperator('AND');
            expect(operator.children).toHaveLength(0);

            const childOperator = new SqlLogicalOperator('OR');
            childOperator.addChild(new SqlCondition('=', 'test', true));

            childOperator.addChild(new SqlCondition('=', 'test2', false));

            operator.addChild(childOperator);

            expect(operator.children).toHaveLength(1);
            expect(childOperator.children).toHaveLength(2);
        });
    });

    describe('build', () => {
        const buildSqlConditionMock = jest.spyOn(
            SqlCondition.prototype,
            'build'
        );

        beforeEach(() => buildSqlConditionMock.mockClear());

        it('builds single AND logical operator with only 1 child into valid SQL', () => {
            const operator = new SqlLogicalOperator('AND');

            operator.addChild(new SqlCondition('=', 'test', 'string'));

            expect(operator.build()).toEqual("test = 'string'");
            expect(buildSqlConditionMock).toHaveBeenCalledTimes(1);
        });

        it('builds single AND logical operator into valid SQL', () => {
            const operator = new SqlLogicalOperator('AND');

            operator.addChild(new SqlCondition('=', 'test', 'string'));
            operator.addChild(new SqlCondition('=', 'test2', false));
            operator.addChild(new SqlCondition('=', 'test3', 10));

            expect(operator.build()).toEqual(
                "(test = 'string' AND test2 = false AND test3 = 10)"
            );
            expect(buildSqlConditionMock).toHaveBeenCalledTimes(3);
        });

        it('builds single OR logical operator into valid SQL', () => {
            const operator = new SqlLogicalOperator('OR');

            operator.addChild(new SqlCondition('=', 'test', 'string'));
            operator.addChild(new SqlCondition('=', 'test2', false));
            operator.addChild(new SqlCondition('=', 'test3', 10));

            expect(operator.build()).toEqual(
                "(test = 'string' OR test2 = false OR test3 = 10)"
            );
            expect(buildSqlConditionMock).toHaveBeenCalledTimes(3);
        });

        it('builds nested AND & OR logical operators into valid SQL', () => {
            const operator = new SqlLogicalOperator('AND');
            const childOperatorAnd = new SqlLogicalOperator('AND');
            const childOperatorOr = new SqlLogicalOperator('OR');

            childOperatorAnd.addChild(new SqlCondition('>', 'value', 70));
            childOperatorAnd.addChild(new SqlCondition('<', 'value', 90));

            childOperatorOr.addChild(new SqlCondition('=', 'value', 102));
            childOperatorOr.addChild(new SqlCondition('=', 'value', 120));

            operator.addChild(childOperatorAnd);
            operator.addChild(childOperatorOr);

            expect(operator.build()).toEqual(
                '((value > 70 AND value < 90) AND (value = 102 OR value = 120))'
            );
            expect(buildSqlConditionMock).toHaveBeenCalledTimes(4);
        });

        it('builds nested AND & OR logical operators and nested conditions into valid SQL', () => {
            const operator = new SqlLogicalOperator('AND');
            const childOperatorAnd = new SqlLogicalOperator('AND');
            const childOperatorOr = new SqlLogicalOperator('OR');

            childOperatorAnd.addChild(new SqlCondition('>', 'value', 70));
            childOperatorAnd.addChild(new SqlCondition('<', 'value', 90));

            childOperatorOr.addChild(new SqlCondition('=', 'value', 102));
            childOperatorOr.addChild(new SqlCondition('=', 'value', 120));

            operator.addChild(childOperatorAnd);
            operator.addChild(childOperatorOr);
            operator.addChild(new SqlCondition('=', 'value_test', 2));

            expect(operator.build()).toEqual(
                '((value > 70 AND value < 90) AND (value = 102 OR value = 120) AND value_test = 2)'
            );
            expect(buildSqlConditionMock).toHaveBeenCalledTimes(5);
        });
    });
});
