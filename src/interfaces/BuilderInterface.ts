import { SqlConditionOperatorType } from '../classes/SqlCondition';
import { SqlLogicalOperatorType } from '../classes/SqlLogicalOperator';

export interface BuilderInterface {
    build(): string;
}
