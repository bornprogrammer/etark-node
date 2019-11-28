import { INestedTransformConfigurationEntity } from './INestedTransformConfigurationEntity';
import { Transformer } from './Transformer';

class NestedTransformConfigurationBuilder {
    private conf: INestedTransformConfigurationEntity[];
    // const conf: INestedTransformConfigurationEntity[] = [{ primary_key_name: 'label', child_name: 'collection', keys: ['label'] }, { primary_key_name: 'question_id', transformer: answersGivenByYouTransformerListIns, selectAll: true }];
    private curIndex: number;
    constructor() {
        this.conf = [];
        this.curIndex = 0;
        this.conf[this.curIndex] = { primary_key_name: '' };
    }

    public setPrimaryKeyName(primaryKeyName: string) {
        this.conf[this.curIndex].primary_key_name = primaryKeyName;
        return this;
    }

    public setChildName(childName: string) {
        this.conf[this.curIndex].child_name = childName;
        return this;
    }

    public setSelectAll() {
        this.conf[this.curIndex].selectAll = true;
        return this;
    }

    public setKeys(keys: string[]) {
        this.conf[this.curIndex].keys = keys;
        return this;
    }

    public setTransformer(transformer: Transformer) {
        this.conf[this.curIndex].transformer = transformer;
        return this;
    }

    public build(): INestedTransformConfigurationEntity[] {
        return this.conf;
    }

    public next = () => {
        this.conf[++this.curIndex] = { primary_key_name: '' };
        return this;
    }
}
export const nestedTransformConfigurationBuilderIns = () => {
    return new NestedTransformConfigurationBuilder();
};
